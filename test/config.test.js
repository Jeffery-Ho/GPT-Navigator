const test = require("node:test");
const assert = require("node:assert/strict");

const config = require("../src/config.js");

test("normalizes synced config values within supported ranges", () => {
  assert.deepEqual(
    config.normalizeConfig({
      topGap: "12.8",
      rightOffset: -10,
      maxVisible: 120,
      tooltipMaxWidth: "bad"
    }),
    {
      topGap: 13,
      rightOffset: 0,
      maxVisible: 80,
      tooltipMaxWidth: 360
    }
  );
});

test("compares only supported config fields", () => {
  assert.equal(
    config.configsEqual(
      { topGap: 8, rightOffset: 14, maxVisible: 30, tooltipMaxWidth: 360 },
      { topGap: 8, rightOffset: 14, maxVisible: 30, tooltipMaxWidth: 360, extra: true }
    ),
    true
  );

  assert.equal(
    config.configsEqual(
      { topGap: 8, rightOffset: 14, maxVisible: 30, tooltipMaxWidth: 360 },
      { topGap: 9, rightOffset: 14, maxVisible: 30, tooltipMaxWidth: 360 }
    ),
    false
  );
});
