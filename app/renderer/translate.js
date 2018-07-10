import ipc from 'electron-better-ipc';
import {createInstance} from 'i18next';
import mem from 'mem';

const instance = createInstance();
const translate = namespaces => mem(namespaces ? instance.getFixedT(null, namespaces) : instance.t.bind(instance));

(async () => {
	const i18n = await ipc.callMain('get-translations');

	instance.init({
		...i18n.options,
		lng: i18n.language,
		resources: i18n.store.data,
	});
})();

export {
	instance,
	translate,
};
