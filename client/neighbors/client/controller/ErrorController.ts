import {Module} from "oak-studio/lib/model/module/Module";
import HeaderView from '../view/Header.ejs';
import ErrorView from '../view/Error.ejs';
import {ejs, generateStateTemplate} from "../app";
import {ApplicationRouter} from "oak-studio/lib/model/ApplicationRouter";


export class ErrorController extends Module {

    use = (app?: ApplicationRouter) => {
        let self = this;
        app.focusModule(this);
        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(HeaderView + ErrorView, generateStateTemplate(), ejs.render, self));
            resolve();
        });

    };

    focus = () => {

        this.loop = requestAnimationFrame(this.update);
    };


    defocus = () => {
        window.cancelAnimationFrame(this.loop);
    }

    update = () => {

        this.loop = window.requestAnimationFrame(this.update);
    }

}
