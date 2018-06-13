import {remote} from 'electron';
import {init} from 'i18next';

const {i18n} = remote.require('./locale');

export const instance = init({...i18n.options, resources: i18n.store.data});
export const translate = namespaces => namespaces ? instance.getFixedT(null, namespaces) : instance.t.bind(instance);
