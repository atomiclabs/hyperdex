import {remote} from 'electron';
import React from 'react';
import _ from 'lodash';
import appContainer from 'containers/App';
import Input from 'components/Input';
import {translate} from '../../translate';

const renamePortfolio = _.debounce(remote.require('./portfolio-util').renamePortfolio, 500);
const t = translate('settings');

class RenamePortfolio extends React.Component {
	state = {
		originalName: appContainer.state.portfolio.name,
	};

	handleBlur = event => {
		const {value} = event.target;
		const {id} = appContainer.state.portfolio;

		if (value.length === 0) {
			this.handleChange(this.state.originalName);
			return;
		}

		renamePortfolio({newName: value, id});
	}

	handleChange = newName => {
		appContainer.updatePortfolio({name: newName});
	};

	render() {
		return (
			<div className="form-group">
				<label>{t('name')}</label>
				<Input
					value={appContainer.state.portfolio.name}
					onBlur={this.handleBlur}
					onChange={this.handleChange}
				/>
			</div>
		);
	}
}

export default RenamePortfolio;
