/** @type {import('stylelint').Config} */
const config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
  ],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
};

export default config; 