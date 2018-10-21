import Adapter from 'enzyme-adapter-react-16';
import {configure} from 'enzyme';
import browserEnv from 'browser-env';
import fetch from 'node-fetch';

configure({adapter: new Adapter()});
browserEnv();
global.fetch = fetch;
