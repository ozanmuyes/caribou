// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'indent': (process.env.NODE_ENV === 'production' ? 2 : 0),
    'no-console': (process.env.NODE_ENV === 'production' ? 2 : 0),
    'no-unused-vars': (process.env.NODE_ENV === 'production' ? 2 : 1),

    'no-param-reassign': 1,
  }
}
