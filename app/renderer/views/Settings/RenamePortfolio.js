import {remote} from 'electron';
import React from 'react';
import appContainer from 'containers/App';
import Input from 'components/Input';
import {translate} from '../../translate';

const {renamePortfolio} = remote.require('./portfolio-util');
const t = translate('settings');

class RenamePortfolio extends React.Component {
	state = {
		isUpdating: false,
	};

	handleChange = async newName => {
		this.setState({isUpdating: true});

		const id = await renamePortfolio({newName, id: appContainer.state.portfolio.id});

		appContainer.updatePortfolio({
			id,
			name: newName,
		});

		this.setState({isUpdating: false});
	};

	render() {
		return (
			<div className="form-group">
				<label>{t('name')}</label>
				<Input value={appContainer.state.portfolio.name} readOnly={this.state.isUpdating} onChange={this.handleChange}/>
			</div>
		);
	}
}

export default RenamePortfolio;
