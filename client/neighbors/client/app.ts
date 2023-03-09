import {ejs as _ejs} from "oak-studio/lib/external/ejs";

import {ApplicationRouter} from "oak-studio/lib/model/ApplicationRouter";
import {Socket} from "oak-studio/lib/model/socket/Socket";
import {Searcher} from "oak-studio/lib/model/Searcher";

import {LandingController} from "./controller/LandingController";
import {ErrorController} from "./controller/ErrorController";
import {PlayController} from "./controller/PlayController";
import {LogInController} from "./controller/LoginController";
import {isApplicationWrapped, isHTTPS} from "oak-studio/utils/wrapper";
import {slugify, timeago} from "oak-studio/lib/model/Utils";

import HeaderView from "./view/Header.ejs";
import SearchView from './view/Search.ejs';
import LogInView from "./view/Login.ejs";

export const ejs = _ejs;
export const socket = new Socket();
export const search_handler = new Searcher();

export const app: ApplicationRouter = new ApplicationRouter();

socket.connect(`ws${isHTTPS() ? "s" : ''}://${window.location.hostname || "192.168.0.67"}/`);

socket.subscribe('handshake', function (e) {
});

socket.subscribe('disconnect', function (e) {
    let b = document.getElementById("beacon");
    if (b) {
        if (b.className.indexOf("offline") === -1) {
            b.className += " offline";
        }
    }
});

socket.subscribe('connect', function (e) {
    let b = document.getElementById("beacon");
    if (b) {
        b.className = b.className.replace(" offline", "");
    }
});


let controller_landing = new LandingController();
let controller_error = new ErrorController();
let controller_login = new LogInController();
let controller_play = new PlayController();

export function generateStateTemplate() {
    let query = "";

    if ((window.location.pathname || "").match('/search/?(.+)?')) {
        query = (window.location.pathname.split("/")[2] || "");
    }

    let dat: any = {
        is_online: socket.connected,
        standalone: isApplicationWrapped(),
        utils: {
            slugify: slugify,
            timeago: timeago
        },
        no_header_bg: false,
        state: false,
        hostname: window.location.hostname,
        search: decodeURIComponent(query),
        search_safe: decodeURIComponent(query).replace(/"/g, '&quot;'),
    };

    dat.profile_link = "login";
    return dat;
}

app.use('/', controller_landing.use);
app.use('/style', controller_landing.style);
app.use('/about', controller_landing.about);
app.use('/terms-of-service', controller_landing.terms);
app.use('/privacy', controller_landing.privacy);
app.use('/play', controller_play.use);
app.use('/cookies', controller_landing.privacy);

app.use('/login', controller_login.use);
app.use('/profile', controller_login.profile);


app.use('/search/?(.+)?', function ():Promise<void> {
    return new Promise(function (resolve, reject) {

        let search_results = search_handler.search(generateStateTemplate().search);

        console.log('ALL SEARCH RESULTS', search_handler.items);

        let data: any = {};
        Object.assign(data, generateStateTemplate());

        if (search_results.length === 0) {
            data.results = `No results found for "${data.search_safe}".`;
        } else {
            data.results = "";
            search_results.forEach(function (result) {
                result.id = ((Math.random() * 100000) | 0) + "";
                data.results += `<div id="${result.id}"><h4>${result.title}</h4><p>${result.desc}</p></div>`;
            });
        }

        document.body.innerHTML = (ejs.render(HeaderView, generateStateTemplate())) +
            (ejs.render(SearchView, data));
        search_results.forEach(function (result) {
            document.getElementById(result.id).onclick = result.fn;
        });

        resolve();
    });
});

app.apply(/(.+)/,  (route)=>{
    console.log('SETTING UP SEARCH');
    const search_pill: HTMLElement = document.getElementById('pill-search-expand');
    const search_pill_input: HTMLInputElement = <HTMLInputElement>document.getElementById('pill-search');
    const search_pill_icon: HTMLElement = document.getElementById('pill-search-icon');
    const navbar: HTMLElement = document.getElementById('navbar');

    const search_input_box: HTMLInputElement = <HTMLInputElement>document.getElementById('search-input-box');
    const search_input_button = document.getElementById('search-input-button');

    if (!search_pill || !search_pill_input || !search_pill_icon || !navbar){
        return new Promise<void>(function (resolve, reject) {
            resolve();
        });
    }

    function isHover(e) {
        return (e.parentElement.querySelector(':hover') === e);
    }

    const updatePillSearchBar = function () {

        if (search_pill_input.value !== '' || document.activeElement === search_pill_input || isHover(search_pill)) {
            document.getElementById('navbar').className = 'navbar bg pill-search-open';
        } else {
            document.getElementById('navbar').className = 'navbar bg';
        }

        if ((<HTMLInputElement>document.getElementById('pill-search')).value !== '') {
            search_pill_icon.className = 'fas fa-arrow-right fa-fw';
        } else {
            search_pill_icon.className = 'fas fa-search fa-fw';
        }

    };

    if (navbar) {

        search_pill.onmouseenter = updatePillSearchBar;
        navbar.onmouseleave = updatePillSearchBar;
        search_pill_input.onblur = updatePillSearchBar;

        search_pill.onclick = function () {
            search_pill_input.focus();
            updatePillSearchBar();
            search_pill_input.focus();
        };


        search_pill_input.onkeyup = search_pill_input.onkeypress = function (e) {
            if (search_input_box) {
                search_input_box.value = search_pill_input.value;
            }
            if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
                if (search_pill_input.value !== "") {
                    // if (!window.navigator['standalone']) {
                    /* iOS hides Safari address bar */
                    //window.history.pushState({data: "okay"}, "unknown", `//${window.location.hostname}/search/${encodeURIComponent(search_pill_input.value)}`);
                    window.history.pushState({data: "okay"}, "unknown", window.location.href);
                    window.location.replace(`//${window.location.hostname}/search/${encodeURIComponent(search_pill_input.value)}`);
                    //}
                    //app.route(`/search/${encodeURIComponent(search_pill_input.value)}`);
                } else {
                    search_pill_input.blur();

                }
            } else {
                // return true;
            }
            updatePillSearchBar();
        };

        search_pill_icon.onclick = function (e) {
            e.preventDefault();
            if (search_pill_input.value !== "") {
                //  if (!window.navigator['standalone']) {
                /* iOS hides Safari address bar */
                window.history.pushState({data: "okay"}, "unknown", window.location.href);
                window.location.replace(`//${window.location.hostname}/search/${encodeURIComponent(search_pill_input.value)}`);
                // }
            }
        };

        updatePillSearchBar();

        return new Promise<void>(function (resolve, reject) {
            resolve();
        });

    }

    if (search_input_box && search_input_button) {
        search_input_box.onkeyup = search_input_box.onkeypress = function (e) {
            if (search_pill_input) {
                search_pill_input.value = search_input_box.value;
                updatePillSearchBar();
            }

            if (e.keyCode === 13 || e.which === 13 || e.key === 'Enter') {
                if (search_input_box.value !== "") {
                    window.history.pushState({data: "okay"}, "unknown", window.location.href);
                    window.location.replace(`//${window.location.hostname}/search/${encodeURIComponent(search_input_box.value)}`);
                } else {
                    search_input_box.blur();
                }
            }
        };
        search_input_button.onclick = function (e) {
            e.preventDefault();
            if (search_input_box.value !== "") {
                window.history.pushState({data: "okay"}, "unknown", window.location.href);
                window.location.replace(`//${window.location.hostname}/search/${encodeURIComponent(search_input_box.value)}`);
            }
        };
    }
});

app.error('/([a-zA-Z0-9-]+)?', controller_error.use);

app.route();

