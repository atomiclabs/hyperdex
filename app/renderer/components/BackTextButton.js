import React from 'react';
import BackArrow from 'icons/BackArrow';
import {translate} from '../translate';

const t = translate('common');

const BackTextButton = props => (
	<React.Fragment>
		<div {...props}>
			<BackArrow size="14px"/>
			<span>{t('back')}</span>
		</div>
		<style jsx>
			{`
				div {
					display: inline-flex;
					align-items: center;
					position: absolute;
					color: var(--text-color);
					transition: color 0.2s ease-in;
					font-size: 14px;
					user-select: none;
					cursor: default;
				}

				div:hover {
					color: var(--text-color2);
				}

				div:active {
					color: var(--text-color);
				}

				div span {
					margin-left: 2px;
				}
			`}
		</style>
	</React.Fragment>
);

export default BackTextButton;
