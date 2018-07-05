import {is} from 'electron-util';
import React from 'react';
import appContainer from 'containers/App';
import NativeSelect from 'components/NativeSelect';
import {translate} from '../../translate';

const t = translate('settings');

class ThemeSetting extends React.Component {
	handleChange = event => {
		const theme = event.target.value;
		appContainer.setTheme(theme);
	};

	render() {
		return (
			<div className="form-group">
				<label>
					{t('theme.theme')}:
				</label>
				<br/>
				<NativeSelect value={appContainer.state.theme} onChange={this.handleChange}>
					<option value="dark">{t('theme.dark')}</option>
					<option value="light">{t('theme.light')}</option>
					{is.macos &&
						<option value="system">{t('theme.system')}</option>
					}
				</NativeSelect>
			</div>
		);
	}
}

export default ThemeSetting;
