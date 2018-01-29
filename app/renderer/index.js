import React from 'react';
import {render} from 'react-dom';
import App from './App';

require('electron-unhandled')();

render(<App/>, document.querySelector('#root'));
