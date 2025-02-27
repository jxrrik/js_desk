/* config-overrides.js */

const {
  addDecoratorsLegacy,
  useEslintRc,
  override,
  addWebpackAlias,
} = require("customize-cra");


const path = require("path");

module.exports = override(
  addDecoratorsLegacy(),
  useEslintRc("./.eslintrc"),
  addWebpackAlias({
    "@hooks": path.resolve(__dirname, "src/hooks"),
    "@components": path.resolve(__dirname, "src/components"),
    "@utils": path.resolve(__dirname, "src/utils"),
    "@styles": path.resolve(__dirname, "src/styles"),
  })
);
