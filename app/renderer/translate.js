import {remote} from 'electron';

let instance;

if (!instance) {
	instance = remote.require('./locale').i18n;
}

export const i18n = instance;
export const translate = namespaces => namespaces ? instance.getFixedT(null, namespaces) : instance.t;
