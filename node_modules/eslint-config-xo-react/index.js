'use strict';
module.exports = {
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: [
		'react'
	],
	rules: {
		'react/boolean-prop-naming': 'error',
		'react/button-has-type': 'error',
		'react/jsx-child-element-spacing': 'error',
		'react/default-props-match-prop-types': 'error',
		'react/no-access-state-in-setstate': 'error',
		'react/no-array-index-key': 'error',
		'react/no-children-prop': 'error',
		'react/no-danger': 'error',
		'react/no-danger-with-children': 'error',
		'react/no-deprecated': 'error',
		'react/no-did-update-set-state': 'error',
		'react/no-direct-mutation-state': 'error',
		'react/no-find-dom-node': 'error',
		'react/no-is-mounted': 'error',
		'react/no-redundant-should-component-update': 'error',
		'react/no-render-return-value': 'error',
		'react/no-typos': 'error',
		'react/no-string-refs': 'error',
		'react/no-this-in-sfc': 'error',
		'react/no-unescaped-entities': 'error',
		'react/no-unknown-property': 'error',
		'react/no-unused-prop-types': 'error',
		'react/no-unused-state': 'error',
		'react/no-will-update-set-state': 'error',
		'react/prop-types': 'error',
		'react/react-in-jsx-scope': 'error',
		'react/require-default-props': ['error', {
			forbidDefaultForRequired: true
		}],
		'react/self-closing-comp': 'error',
		'react/style-prop-object': 'error',
		'react/void-dom-elements-no-children': 'error',
		'react/jsx-boolean-value': 'error',
		'react/jsx-closing-bracket-location': ['error', {
			nonEmpty: 'tag-aligned',
			selfClosing: false
		}],
		'react/jsx-closing-tag-location': 'error',
		'react/jsx-curly-spacing': ['error', 'never'],
		'react/jsx-equals-spacing': ['error', 'never'],
		'react/jsx-indent': ['error', 'tab'],
		'react/jsx-indent-props': ['error', 'tab'],
		'react/jsx-key': 'error',
		'react/jsx-max-props-per-line': ['error', {
			maximum: 3,
			when: 'multiline'
		}],
		'react/jsx-no-bind': [
			'error',
			{
				allowArrowFunctions: true
			}
		],
		'react/jsx-no-comment-textnodes': 'error',
		'react/jsx-no-duplicate-props': ['error', {
			ignoreCase: true
		}],
		'react/jsx-no-target-blank': 'error',
		'react/jsx-no-undef': 'error',
		// 'react/jsx-one-expression-per-line': 'error',
		'react/jsx-curly-brace-presence': ['error', 'never'],
		'react/jsx-pascal-case': 'error',
		'react/jsx-sort-props': ['error', {
			callbacksLast: true,
			shorthandFirst: true,
			noSortAlphabetically: true,
			reservedFirst: true
		}],
		'react/jsx-tag-spacing': ['error', {
			closingSlash: 'never',
			beforeSelfClosing: 'never',
			afterOpening: 'never',
			beforeClosing: 'never'
		}],
		'react/jsx-uses-react': 'error',
		'react/jsx-uses-vars': 'error',
		'react/jsx-wrap-multilines': ['error', {
			declaration: 'parens-new-line',
			assignment: 'parens-new-line',
			return: 'parens-new-line',
			arrow: 'parens-new-line',
			condition: 'ignore',
			logical: 'ignore',
			prop: 'ignore'
		}]
	}
};
