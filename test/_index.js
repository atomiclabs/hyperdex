import Adapter from 'enzyme-adapter-react-16';
import {configure} from 'enzyme';
import browserEnv from 'browser-env';

configure({adapter: new Adapter()});
browserEnv();
