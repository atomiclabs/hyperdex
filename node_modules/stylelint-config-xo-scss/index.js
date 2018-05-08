'use strict';

const reLowercase = /^[a-z]+(-[a-z\d]+)*$/;

module.exports = {
	extends: 'stylelint-config-xo',
	plugins: [
		'stylelint-scss'
	],
	rules: {
		'at-rule-no-unknown': null,
		'at-rule-empty-line-before': null,
		'scss/at-else-if-parentheses-space-before': 'always',
		'scss/at-extend-no-missing-placeholder': true,
		'scss/at-function-parentheses-space-before': 'never',
		'scss/at-function-pattern': reLowercase,
		'scss/at-import-no-partial-leading-underscore': true,
		'scss/at-import-partial-extension-blacklist': [
			'scss'
		],
		'scss/at-mixin-argumentless-call-parentheses': 'never',
		'scss/at-mixin-parentheses-space-before': 'never',
		'scss/at-mixin-pattern': reLowercase,
		'scss/at-rule-no-unknown': true,
		// Disabled because of https://github.com/kristerkari/stylelint-scss/issues/203
		// 'scss/dollar-variable-colon-newline-after': 'always-multi-line',
		'scss/dollar-variable-colon-space-after': 'at-least-one-space',
		'scss/dollar-variable-colon-space-before': 'never',
		'scss/dollar-variable-no-missing-interpolation': true,
		'scss/dollar-variable-pattern': reLowercase,
		'scss/percent-placeholder-pattern': reLowercase,
		// Disabled because of https://github.com/kristerkari/stylelint-scss/issues/202
		// 'scss/double-slash-comment-whitespace-inside': 'always',
		'scss/declaration-nested-properties': 'never',
		'scss/declaration-nested-properties-no-divided-groups': true,
		'scss/operator-no-unspaced': true,
		'scss/partial-no-import': true,
		'scss/selector-no-redundant-nesting-selector': true,
		'scss/no-duplicate-dollar-variables': true
	}
};
