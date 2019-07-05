import {JetView} from "webix-jet";

export default class LoginView extends JetView{
    config(){
        const login_form = {
            view:"form", localId:"login:form",
            width:400, borderless:false, margin:10,
            rows:[
                { type:"header", template: "集智创新知识产权管理系统" },
                { view:"text", name:"login", label:"用户名", labelPosition:"top" },
                { view:"text", type:"password", name:"pass", label:"密码", labelPosition:"top" },
                { view:"button", value:"登录", click:() => this.do_login(), hotkey:"enter" }
            ],
            rules:{
                login:webix.rules.isNotEmpty,
                pass:webix.rules.isNotEmpty
            }
        };

        return {
            cols:[{}, { rows:[{}, login_form, {}]}, {}]
        };
    }

    init(view){
        view.$view.querySelector("input").focus();
    }

    do_login(){
        const user = this.app.getService("user");
        const form = this.$$("login:form");

        if (form.validate()){
            const data = form.getValues();
            user.login(data.login, data.pass).catch(function(){
                webix.html.removeCss(form.$view, "invalid_login");
                form.elements.pass.focus();
                webix.delay(function(){
                    webix.html.addCss(form.$view, "invalid_login");
                });
            });
        }
    }
}