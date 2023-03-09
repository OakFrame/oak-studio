import {Module} from "oak-studio/lib/model/module/Module";
import LogInView from "../view/Login.ejs";
import ProfileView from "../view/Profile.ejs";
import HeaderView from "../view/Header.ejs";
import {app, ejs, generateStateTemplate} from "../app";

export class LogInController extends Module {

    use = (app?) => {
        let self = this;
        //console.log(state, state.account.isAuthenticated());
      /*  if (state.account && state.account.isAuthenticated()){
            return new Promise<void>(function (resolve, reject) { app.goToPage("/profile");
                resolve();
            });
         }*/
        return new Promise<void>(function (resolve, reject) {

            document.body.innerHTML = (app.render(HeaderView + LogInView, generateStateTemplate(), ejs.render, self));
            resolve();
        });

    };

    profile = () => {
        let self = this;
     /*   if (!state.account || !state.account.isAuthenticated()) {
            return new Promise<void>(function (resolve, reject) { app.goToPage("/login");
                resolve();
            });
        }*/
        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(HeaderView + ProfileView, generateStateTemplate(), ejs.render, self));
            resolve();
        });

    };

}
