import React from 'react';
import {withState} from 'containers/SuperContainer';
import Tooltip from 'components/Tooltip';
import CopyButton from 'components/CopyButton';
import {translate} from '../translate';

const t = translate('common');

const CopyIconButton = withState(
	({setState, state, ...props}) => (
		<Tooltip
			content={state.isCopied ? t('copied') : t('copy')}
			onClose={() => {
				setState({isCopied: false});
			}}
		>
			<CopyButton
				{...props}
				onClick={() => {
					setState({isCopied: true});
				}}
			/>
		</Tooltip>
	),
	{isCopied: false}
);

CopyIconButton.propTypes = CopyButton.propTypes;

export default CopyIconButton;
