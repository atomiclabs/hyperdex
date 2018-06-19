import {init} from 'i18next';

const {i18n} = global.mainModules;

export const instance = init({...i18n.options, resources: i18n.store.data});
export const translate = namespaces => namespaces ? instance.getFixedT(null, namespaces) : instance.t.bind(instance);
