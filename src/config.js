(function initPolarisConfig(root) {
  const QUEUE_MAX_VISIBLE = 30;
  const CONFIG_STORAGE_KEY = "gpt-paragraph-nav-config";
  const CONFIG_FIELDS = Object.freeze([
    { key: "topGap", label: "顶部间距", min: 0, max: 80, step: 1, unit: "px" },
    { key: "rightOffset", label: "右侧间距", min: 0, max: 80, step: 1, unit: "px" },
    { key: "maxVisible", label: "最大数量", min: 1, max: 80, step: 1, unit: "" },
    { key: "tooltipMaxWidth", label: "提示宽度", min: 160, max: 720, step: 10, unit: "px" }
  ]);
  const DEFAULT_CONFIG = Object.freeze({
    topGap: 8,
    rightOffset: 14,
    maxVisible: QUEUE_MAX_VISIBLE,
    tooltipMaxWidth: 360
  });
  const MESSAGE_TYPES = Object.freeze({
    GET_CONFIG: "polaris:config:get",
    SET_CONFIG: "polaris:config:set",
    CONFIG_CHANGED: "polaris:config:changed"
  });

  function normalizeNumber(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return fallback;
    }
    return Math.min(Math.max(Math.round(number), min), max);
  }

  function normalizeConfig(config) {
    return CONFIG_FIELDS.reduce((result, field) => {
      result[field.key] = normalizeNumber(
        config && config[field.key],
        DEFAULT_CONFIG[field.key],
        field.min,
        field.max
      );
      return result;
    }, {});
  }

  function configsEqual(first, second) {
    return CONFIG_FIELDS.every((field) => first[field.key] === second[field.key]);
  }

  const api = {
    CONFIG_STORAGE_KEY,
    CONFIG_FIELDS,
    DEFAULT_CONFIG,
    MESSAGE_TYPES,
    normalizeConfig,
    configsEqual
  };

  root.PolarisConfig = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
