import "./styles/app.css";
import {JetApp, HashRouter, plugins } from "webix-jet";
import session from "models/session";

export default class MyApp extends JetApp{
	constructor(config){
		const size = () => {
			const screen = document.body.offsetWidth;
			return screen > 1210 ? "wide" : (screen > 1060 ? "mid" : "small");
		};

		let theme = "";
		let cookies = true;
		try {
			theme = webix.storage.local.get("bank_app_theme");
		}
		catch(err){
			cookies = false;
			webix.message("You disabled cookies. The language and theme won't be restored after page reloads.","debug");
		}

		const defaults = {
			id			: APPNAME,
			version 	: VERSION,
			router 		: HashRouter,
			debug 		: !PRODUCTION,
			start 		: "/top/transactions",
			theme		: theme || "",
			dateFormat	: "%j %F, %H:%i",
			listLength	: 50,
			size		: size(),
			views:{
				"information":"customers.information",
				"statistics":"customers.statistics",
				"paymenthistory":"customers.paymenthistory"
			}
		};

		super({ ...defaults, ...config });

		let localeConfig = {
			webix:{
				en:"en-US",
				zh:"zh-CN",
				es:"es-ES",
				ko:"ko-KR",
				ru:"ru-RU",
				de:"de-DE"
			}
		};
		if (cookies)
			localeConfig.storage = webix.storage.local;

		this.use(plugins.Locale, localeConfig);

		this.use( plugins.User, { model : session });

		webix.event(window, "resize", () => {
			const newSize = size();
			if (newSize != this.config.size){
				this.config.size = newSize;
				this.refresh();
			}
		});

		this.attachEvent("app:error:resolve", function() {
			webix.delay(() => this.show("/top/transactions"));
		});
	}
}

if (!BUILD_AS_MODULE){
	webix.ready(() => {
		if (!webix.env.touch && webix.env.scrollSize && webix.CustomScroll)
			webix.CustomScroll.init();
		new MyApp().render();
	});
}

//track js errors
if (PRODUCTION){
	window.Raven
		.config(
			"https://59d0634de9704b61ba83823ec3bf4787@sentry.webix.io/12"
		)
		.install();
}
