import {is} from 'electron-util';
import {Container} from 'unstated';
import unstatedDebug from 'unstated-debug';

const makeDebuggable = unstatedDebug({
	isEnabled: is.development,
	logStateChanges: false,
});

export default makeDebuggable(Container);
