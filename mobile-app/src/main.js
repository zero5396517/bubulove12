import { createSSRApp } from "vue";
import App from "./App.vue";
import uViewPro from "uview-pro";

export function createApp() {
	const app = createSSRApp(App);
	app.use(uViewPro);
	return {
		app,
	};
}
