import {Container} from 'unstated';

class SettingsContainer extends Container {
	state = {
		isUpdatingCurrencies: false,
	};

	setIsUpdatingCurrencies = isUpdatingCurrencies => {
		this.setState({isUpdatingCurrencies});
	};
}

const settingsContainer = new SettingsContainer();

export default settingsContainer;
