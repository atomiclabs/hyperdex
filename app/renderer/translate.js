import {remote} from 'electron';
import {init} from 'i18next';

const {i18n} = remote.require('./locale');
const instance = init({...i18n.options, lng: remote.app.getLocale(), resources: i18n.store.data});
const translate = namespaces => namespaces ? instance.getFixedT(null, namespaces) : instance.t.bind(instance);

export {
	instance,
	translate,
};
