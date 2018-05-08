'use strict';
// - const propertiesOrder = require('./properties-order');

// Allows:
// foo-bar
// FooBar
// foo-bar--foo-bar
// foo-bar__foo-bar
// FooBar--FooBar
// FooBar__FooBar
// FooBar--foo-bar
// foo-bar--FooBar
// Foo-bar
// …
const reLowerCaseFirstUpper = /([A-Z][a-z\d]*(-[a-z\d]+)*)/;
const reLowerCase = /([a-z][a-z\d]*(-[a-z\d]+)*)/;
const rePascalCase = /(([A-Z][a-zA-Z\d]+)*)/;
const reName = new RegExp(`^(${reLowerCaseFirstUpper.source}|${reLowerCase.source}|${rePascalCase.source})((--|__)(${reLowerCase.source}|${rePascalCase.source}))*$`);

module.exports = {
	plugins: [
		'stylelint-order',
		'stylelint-declaration-block-no-ignored-properties'
	],
	rules: {
		'color-no-invalid-hex': true,
		'font-family-no-duplicate-names': true,
		'font-family-no-missing-generic-family-keyword': true,
		'function-calc-no-unspaced-operator': true,
		'function-linear-gradient-no-nonstandard-direction': true,
		'string-no-newline': true,
		'unit-no-unknown': true,
		'shorthand-property-no-redundant-values': true,
		'property-no-unknown': true,
		'keyframe-declaration-no-important': true,
		'declaration-block-no-duplicate-properties': true,
		'declaration-block-no-redundant-longhand-properties': [
			true,
			{
				ignoreShorthands: [
					'grid-template'
				]
			}
		],
		'declaration-block-no-shorthand-property-overrides': true,
		'block-no-empty': true,
		'selector-pseudo-class-no-unknown': true,
		'selector-pseudo-element-no-unknown': true,
		'selector-type-no-unknown': true,
		'media-feature-name-no-unknown': true,
		'at-rule-no-unknown': true,
		'comment-no-empty': true,
		// Disabled because of https://github.com/stylelint/stylelint/issues/3196
		// 'no-descending-specificity': true,
		'no-duplicate-at-import-rules': true,
		'no-duplicate-selectors': true,
		'no-empty-source': true,
		'no-extra-semicolons': true,
		'no-invalid-double-slash-comments': true,
		'no-unknown-animations': true,
		'color-named': 'never',
		'function-url-no-scheme-relative': true,
		'number-max-precision': 3,
		'time-min-milliseconds': 100,
		'value-no-vendor-prefix': [
			true,
			{
				ignoreValues: [
					'grab',
					'grabbing',
					'tab-size' // It's still only prefixed in Firefox
				]
			}
		],
		'property-blacklist': [
			'float'
		],
		'property-no-vendor-prefix': [
			true,
			{
				ignoreProperties: [
					'app-region', // For Electron
					'appearance',
					'mask'
				]
			}
		],
		'declaration-no-important': true,
		'declaration-property-value-blacklist': {
			'/^border(?!-(width|spacing))/': [
				'/thin/', // TODO: Use regex literal here when https://github.com/stylelint/stylelint/issues/3008 is fixed
				'/medium/',
				'/thick/',
				'0' // Prefer `none`
			],
			'/^transition/': [
				'/all/'
			]
		},
		'selector-class-pattern': reName,
		'selector-id-pattern': reName,
		'selector-max-attribute': 8,
		'selector-max-class': 8,
		'selector-max-compound-selectors': 8,
		'selector-max-empty-lines': 0,
		'selector-max-universal': 1,
		// Disabled because of https://github.com/stylelint/stylelint/issues/3197
		// 'selector-no-vendor-prefix': true,
		'media-feature-name-no-vendor-prefix': true,
		'at-rule-no-vendor-prefix': true,
		'comment-word-blacklist': [
			[
				'/^TODO:/',
				'/^FIXME:/',
				'fuck',
				'shit',
				'damn',
				'twerk',
				'egg yolk'
			],
			{
				severity: 'warning'
			}
		],
		'max-nesting-depth': 8,
		'color-hex-case': 'lower',
		'color-hex-length': 'short',
		'font-family-name-quotes': 'always-where-recommended',
		'font-weight-notation': 'named-where-possible',
		'function-comma-newline-after': 'never-multi-line',
		'function-comma-newline-before': 'never-multi-line',
		'function-comma-space-after': 'always',
		'function-comma-space-before': 'never',
		'function-max-empty-lines': 0,
		'function-name-case': 'lower',
		'function-parentheses-newline-inside': 'never-multi-line',
		'function-parentheses-space-inside': 'never',
		'function-url-quotes': 'always',
		'function-whitespace-after': 'always',
		'number-leading-zero': 'always',
		'number-no-trailing-zeros': true,
		'string-quotes': ['single', {avoidEscape: false}],
		'length-zero-no-unit': true,
		'unit-case': 'lower',
		'value-keyword-case': 'lower',
		// Disabled because of https://github.com/stylelint/stylelint/issues/2906
		// 'value-list-comma-newline-after': 'always-multi-line',
		'value-list-comma-newline-before': 'never-multi-line',
		'value-list-comma-space-after': 'always-single-line',
		'value-list-comma-space-before': 'never',
		'value-list-max-empty-lines': 0,
		'property-case': 'lower',
		'declaration-bang-space-after': 'never',
		'declaration-bang-space-before': 'always',
		'declaration-colon-newline-after': 'always-multi-line',
		'declaration-colon-space-after': 'always-single-line',
		'declaration-colon-space-before': 'never',
		'declaration-empty-line-before': 'never',
		'declaration-block-semicolon-newline-after': 'always',
		'declaration-block-semicolon-newline-before': 'never-multi-line',
		'declaration-block-semicolon-space-after': 'always-single-line',
		'declaration-block-semicolon-space-before': 'never',
		'declaration-block-trailing-semicolon': 'always',
		'block-closing-brace-empty-line-before': 'never',
		'block-closing-brace-newline-after': 'always',
		'block-closing-brace-newline-before': 'always',
		'block-opening-brace-newline-after': 'always',
		'block-opening-brace-space-before': 'always',
		'selector-attribute-brackets-space-inside': 'never',
		'selector-attribute-operator-space-after': 'never',
		'selector-attribute-operator-space-before': 'never',
		'selector-attribute-quotes': 'always',
		'selector-combinator-space-after': 'always',
		'selector-combinator-space-before': 'always',
		'selector-descendant-combinator-no-non-space': true,
		'selector-pseudo-class-case': 'lower',
		'selector-pseudo-class-parentheses-space-inside': 'never',
		'selector-pseudo-element-case': 'lower',
		'selector-pseudo-element-colon-notation': 'double',
		'selector-type-case': 'lower',
		'selector-list-comma-newline-after': 'always',
		'selector-list-comma-newline-before': 'never-multi-line',
		'selector-list-comma-space-after': 'always-single-line',
		'selector-list-comma-space-before': 'never',
		'rule-empty-line-before': [
			'always',
			{
				except: [
					'after-single-line-comment',
					'first-nested'
				],
				ignore: [
					'after-comment'
				]
			}
		],
		'media-feature-colon-space-after': 'always',
		'media-feature-colon-space-before': 'never',
		'media-feature-name-case': 'lower',
		'media-feature-parentheses-space-inside': 'never',
		'media-feature-range-operator-space-after': 'always',
		'media-feature-range-operator-space-before': 'always',
		'media-query-list-comma-newline-after': 'always',
		'media-query-list-comma-newline-before': 'never-multi-line',
		'media-query-list-comma-space-before': 'never',
		'at-rule-empty-line-before': [
			'always',
			{
				except: [
					'after-same-name',
					'inside-block'
				],
				ignore: [
					'after-comment'
				]
			}
		],
		'at-rule-name-case': 'lower',
		'at-rule-name-newline-after': 'always-multi-line',
		'at-rule-name-space-after': 'always-single-line',
		'at-rule-semicolon-newline-after': 'always',
		'at-rule-semicolon-space-before': 'never',
		'comment-whitespace-inside': 'always',
		indentation: 'tab',
		'max-empty-lines': 2,
		'no-eol-whitespace': true,
		'no-missing-end-of-source-newline': true,

		// `stylelint-order`
		'order/order': [
			'dollar-variables',
			'custom-properties',
			'declarations',
			'rules'
		],
		// Disabled for now: https://github.com/sindresorhus/stylelint-config-xo/pull/2#issuecomment-363438756
		// 'order/properties-order': propertiesOrder,

		// `stylelint-declaration-block-no-ignored-properties`
		'plugin/declaration-block-no-ignored-properties': true
	}
};
