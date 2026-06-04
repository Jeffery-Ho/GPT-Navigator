importScripts("config.js");

const {
  CONFIG_STORAGE_KEY,
  DEFAULT_CONFIG,
  MESSAGE_TYPES,
  normalizeConfig
} = globalThis.PolarisConfig;

const SUPPORTED_TAB_URLS = [
  "https://chatgpt.com/*",
  "https://chat.openai.com/*",
  "https://www.doubao.com/*"
];

function hasSyncStorage() {
  return typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync;
}

function readSyncConfig() {
  if (!hasSyncStorage()) {
    return Promise.resolve({ config: null, hasValue: false, syncEnabled: false });
  }

  return new Promise((resolve) => {
    chrome.storage.sync.get(CONFIG_STORAGE_KEY, (result) => {
      if (chrome.runtime.lastError) {
        console.warn("[Polaris for Web] config sync read failed", chrome.runtime.lastError);
        resolve({ config: null, hasValue: false, syncEnabled: false });
        return;
      }

      if (Object.prototype.hasOwnProperty.call(result, CONFIG_STORAGE_KEY)) {
        resolve({
          config: normalizeConfig(result[CONFIG_STORAGE_KEY]),
          hasValue: true,
          syncEnabled: true
        });
        return;
      }

      resolve({ config: null, hasValue: false, syncEnabled: true });
    });
  });
}

function writeSyncConfig(config) {
  if (!hasSyncStorage()) {
    return Promise.resolve(false);
  }

  const nextConfig = normalizeConfig(config);
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [CONFIG_STORAGE_KEY]: nextConfig }, () => {
      if (chrome.runtime.lastError) {
        console.warn("[Polaris for Web] config sync write failed", chrome.runtime.lastError);
        resolve(false);
        return;
      }

      resolve(true);
    });
  });
}

async function getConfig(legacyConfig) {
  const syncResult = await readSyncConfig();
  if (syncResult.hasValue) {
    return {
      config: syncResult.config,
      syncEnabled: syncResult.syncEnabled
    };
  }

  if (legacyConfig) {
    const migratedConfig = normalizeConfig(legacyConfig);
    const syncEnabled = await writeSyncConfig(migratedConfig);
    return {
      config: migratedConfig,
      syncEnabled
    };
  }

  return {
    config: { ...DEFAULT_CONFIG },
    syncEnabled: syncResult.syncEnabled
  };
}

async function setConfig(config) {
  const nextConfig = normalizeConfig(config);
  const syncEnabled = await writeSyncConfig(nextConfig);
  return {
    config: nextConfig,
    syncEnabled
  };
}

function broadcastConfig(config, syncEnabled) {
  const message = {
    type: MESSAGE_TYPES.CONFIG_CHANGED,
    config: normalizeConfig(config),
    syncEnabled
  };

  if (!chrome.tabs || !chrome.tabs.query || !chrome.tabs.sendMessage) {
    return;
  }

  chrome.tabs.query({ url: SUPPORTED_TAB_URLS }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.warn("[Polaris for Web] config tab query failed", chrome.runtime.lastError);
      return;
    }

    tabs.forEach((tab) => {
      if (!tab.id) {
        return;
      }

      chrome.tabs.sendMessage(tab.id, message, () => {
        void chrome.runtime.lastError;
      });
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type === MESSAGE_TYPES.GET_CONFIG) {
    getConfig(message && message.legacyConfig).then(sendResponse);
    return true;
  }

  if (message.type === MESSAGE_TYPES.SET_CONFIG) {
    setConfig(message.config).then(sendResponse);
    return true;
  }

  return false;
});

if (hasSyncStorage() && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes[CONFIG_STORAGE_KEY]) {
      return;
    }

    broadcastConfig(changes[CONFIG_STORAGE_KEY].newValue, true);
  });
}
