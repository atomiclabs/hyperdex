import {remote} from 'electron';
import React from 'react';
import appContainer from 'containers/App';
import Button from 'components/Button';
import {translate} from '../../translate';

const {deletePortfolio} = remote.require('./portfolio-util');
const t = translate('settings');

class DeletePortfolio extends React.Component {
	handleClick = () => {
		deletePortfolio(appContainer.state.portfolio.id);
		appContainer.logOut();
	}

	render() {
		return (
			<div className="form-group">
				<Button
					value={t('deletePortfolio')}
					color="red"
					onClick={this.handleClick}
				/>
			</div>
		);
	}
}

export default DeletePortfolio;
