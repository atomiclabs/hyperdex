import React from 'react';
import PropTypes from 'prop-types';
import CopyButton from 'components/CopyButton';
import ReloadButton from 'components/ReloadButton';
import Tooltip from 'components/Tooltip';
import WrapWidth from 'components/WrapWidth';
import {translate} from '../translate';
import './SeedPhrase.scss';

const t = translate(['common']);

class SeedPhrase extends React.Component {
	static propTypes = {
		value: PropTypes.string.isRequired,
		showCopy: PropTypes.bool,
		showReload: PropTypes.bool,
		onReload: PropTypes.func,
	}

	static defaultProps = {
		showCopy: true,
		showReload: false,
		onReload: () => {},
	}

	state = {
		isCopied: false,
	}

	handleClose = () => {
		this.setState({isCopied: false});
	}

	handleCopy = () => {
		this.setState({isCopied: true});
	}

	handleReload = event => {
		const {onReload} = this.props;
		this.setState({isCopied: false});
		onReload(event);
	}

	render() {
		const {value, showCopy, showReload} = this.props;
		const {isCopied} = this.state;

		return (
			<div className="SeedPhrase">
				{showReload && (
					<div className="section section--reload">
						<ReloadButton onClick={this.handleReload}/>
					</div>
				)}
				<div className="section section--value">
					<WrapWidth wordsPerLine={6}>
						{value}
					</WrapWidth>
				</div>
				{showCopy && (
					<div className="section section--copy">
						<Tooltip
							content={isCopied ? t('copied') : t('copy')}
							onClose={this.handleClose}
						>
							<CopyButton
								value={value}
								onClick={this.handleCopy}
							/>
						</Tooltip>
					</div>
				)}
			</div>
		);
	}
}

export default SeedPhrase;
