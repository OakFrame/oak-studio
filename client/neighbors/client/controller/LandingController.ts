import {Module} from "oak-studio/lib/model/module/Module";
import LandingView from '../view/Landing.ejs';
import AboutView from '../view/About.ejs';
import StyleView from '../view/Style.ejs';
import TermsView from '../view/Terms.ejs';
import PrivacyView from '../view/Privacy.ejs';
import HeaderView from '../view/Header.ejs';
import InfobarView from '../view/Infobar.ejs';
import {ejs, generateStateTemplate, search_handler, app} from "../app";
import {ApplicationRouter} from "oak-studio/lib/model/ApplicationRouter";
import { TextField } from "oak-studio/lib/model/graph/TextField";
import { SelectField } from "oak-studio/lib/model/graph/SelectField";
import { SliderField } from "oak-studio/lib/model/graph/SliderField";
import {SearchResult} from "oak-studio/lib/model/Searcher";

export class LandingController extends Module {

    constructor() {

        super();

        search_handler.addResult(new SearchResult("Home Page","The home page of this application.",['*','home','help','info','oakframe','oak'], function(){
            app.goToPage(`//${window.location.hostname}/`);
        }));

        search_handler.addResult(new SearchResult("Terms of Service","The Terms and Service",['*','terms','service'], function(){
            app.goToPage(`//${window.location.hostname}/terms-of-service`);
        }));

        search_handler.addResult(new SearchResult("Style Guide","Developer Style Guide",['*','guide','style'], function(){
            app.goToPage(`//${window.location.hostname}/style`);
        }));

    }


    use = (app?: ApplicationRouter) => {
        let self = this;
        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(InfobarView +HeaderView + LandingView, generateStateTemplate(), ejs.render, self));
            resolve();
        });

    };

    about = (app?: ApplicationRouter) => {
        let self = this;
        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(HeaderView + AboutView, generateStateTemplate(), ejs.render, self));
            resolve();
        });

    };

    terms = (app?: ApplicationRouter) => {
        let self = this;
        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(HeaderView + TermsView, generateStateTemplate(), ejs.render, self));
            resolve();
        });
    };

    privacy = (app?: ApplicationRouter) => {
        let self = this;
        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(HeaderView + PrivacyView, generateStateTemplate(), ejs.render, self));
            resolve();
        });
    };

    style = (app?: ApplicationRouter) => {
        let self = this;
        return new Promise<void>(function (resolve, reject) {
            document.body.innerHTML = (app.render(HeaderView + StyleView, generateStateTemplate(), ejs.render, self));

            let el = document.getElementById('fields');

            let tf = new TextField("value","Text Input");
            el.appendChild(tf.getElement());
            let ssf = new SliderField({value:50, text:"Number of Cats"},25);
            el.appendChild(ssf.getElement());

            let sf = new SelectField([{
                value:"1", text:"first"},
                {value:"1", text:"second"},
                { value:"2", text:"last"}],
                "3"); el.appendChild(sf.getElement());

            resolve();
        });

    };

}
