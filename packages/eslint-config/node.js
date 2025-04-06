/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [
    '@atom/eslint-config',
  ],
  env: {
    node: true,
    browser: false,
  },
  rules: {
    'no-process-exit': 'error',
    'no-console': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
  },
}; 