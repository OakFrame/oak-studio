import {Module} from "./module/Module";
import {Layer} from "./Layer";
import {SubscribeInterface} from "../interface/SubscribeInterface";
import {ModuleRouter} from "./ModuleRouter";
// @ts-ignore
import {v4 as uuidv4} from "uuid";
import {isApplicationWrapped} from "../../utils/wrapper";

export class ApplicationRouter implements ModuleRouter, SubscribeInterface {

    public _modules: Module[] = [];
    private stack: Array<Layer>;
    private error_stack: Array<Layer>;
    private _subscribers: any[];
    private _route:string;

    constructor() {
        this._subscribers = [];
        let app = this;
        this._modules = [];
        this.stack = [];
        this.error_stack = [];

        document.body.addEventListener('click', function (event) {
            const clickedElem: any = event.target;
            let target = clickedElem.closest("a");

            if (target && target.hasAttribute('href')) {
                if ((target.getAttribute('href') || "").slice(0, 5) === "/api/") {
                    window.location = target.hasAttribute('href')
                } else {
                    console.log("application router target href",target.getAttribute('href'));
                    let relative_link=target.getAttribute('href');
                    //if (isApplicationWrapped()){
                     //   relative_link = relative_link.slice(1,relative_link.length-1)
                    //}
                    app.goToPage(relative_link, event);
                }
            }
        }, false);


        if (!window.navigator['standalone'] && !isApplicationWrapped()) {
            window.addEventListener('popstate', function (e) {
                app.route();
            });
        }

    }

    public goToPage(route: string, event?) {
        let rel_route = route.replace(`//${window.location.hostname}`, "");


        if (!window.navigator['standalone'] && !isApplicationWrapped()) {
            /* iOS hides Safari address bar */
            window.history.pushState({data: "okay"}, "unknown", route);
        }
        this.route(rel_route);
        /* iOS re-orientation fix */
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

    public focusModule(module: Module) {
        this._modules.push(module)
    }

    public use(route, fn?): void {
        this.stack.push(new Layer(route, fn));
    }

    public error(route, fn?): void {
        this.error_stack.push(new Layer(route, fn));
    }

    public route(url?) {
        let self = this;

        let request_url = url || window.location.pathname || window.location.href;

        this._route = request_url;

        let chain: Array<Layer> = [];
        this.stack.forEach(function (layer: Layer) {
            let match = request_url.match(layer.route);
            if (match) {
                chain.push(layer);
            }
        });

        this._modules.forEach(function (module) {
            module.defocus();
            module._binds.forEach(function (b) {
                self.unsubscribe(b.identifier, b.uuid);
            });
            module._binds = [];
        });
        this._modules = [];

        return new Promise<void>(function (resolve, reject) {
            function process() {
                if (chain.length > 0) {
                    let layer: Layer = chain.shift();
                    layer.fn(self).then(function () {
                        process();
                    }).catch(function (e) {
                        console.trace(e, "chain failure");
                        reject('Chain Failed');
                    });
                } else {
                    resolve();
                }
            }

            function process_error() {
                if (chain.length > 0) {
                    let layer: Layer = chain.shift();
                    layer.fn(self).then(function () {
                        process_error();
                    }).catch(function (e) {
                        console.trace(e, "chain failure");
                        reject('Chain Failed');
                    });
                } else {
                    resolve();
                }
            }

            if (chain.length > 0) {
                process();
            } else {
                chain = self.error_stack.slice(0, self.error_stack.length);
                process_error();
            }

        }).then(function () {
            self.publish('route', false);
            self._modules.forEach(function (module) {
                module.focus(self);
            });
        });

    }

    render(view: string, data: any, renderer: any, module?: Module) {
        let self = this;
        if (module) {
            let _dom = document.createElement('div');
            _dom.innerHTML = renderer(view, data);

            let _es = _dom.querySelectorAll(`[data-bind]`);

            for (let i = 0; i < _es.length; i++) {
                (function (app, i, elem) {
                    // let u = uuidv4();
                    //elem.id = u;
                    //elem.setAttribute('id', u);
                    let id = elem.getAttribute('data-bind');
                    module._binds.push({
                        identifier: id, uuid: app.subscribe(id, function (d) {

                           /* let _s_dom = document.createElement('div');
                            console.log('RENDER B ',data, d);
                            _s_dom.innerHTML = renderer(view, data);

                            let _ea = document.querySelectorAll(`[data-bind]`);
                            let _es = _s_dom.querySelectorAll(`[data-bind]`);*/
                            //_ea[i].innerHTML = _es[i].innerHTML;
                            /*for (let x = 0; x < _ea.length; x++) {
                                if (_ea[x].getAttribute('data-bind') === id) {
                                    console.log('FOUND MATCHING ELEMENT', id);

                                    //console.log(elem.innerHTML, _ea[x].innerHTML);
                                    //elem.innerHTML = _ea[x].innerHTML+"";// = renderer(inner_html, d);
                                    //document.getElementById(u).innerHTML = (_ea[x].innerHTML+"");
                                }
                            }*/

                        })
                    });
                })(self, i, _es[i]);

            }
        }


        return renderer(view, data);
    }

    subscribe(identifier: string, callback: any): string {
        if (!this._subscribers[identifier]) {
            this._subscribers[identifier] = [];
        }
        let u = uuidv4();
        this._subscribers[identifier].push({uuid: u, fn: callback});
        //TODO return UUID here
        return u;
    }

    publish(identifier, data?): any {
        if (this._subscribers[identifier]) {
            this._subscribers[identifier].forEach(function (subscriberOb) {
                subscriberOb.fn(data);
            });
        }
    }

    unsubscribe(identifier, uuid) {
        if (this._subscribers[identifier]) {
            let idx = -1;
            this._subscribers[identifier].forEach(function (subOb, i) {
                if (uuid === subOb.uuid) {
                    idx = i;
                }
            });
            if (idx != -1) {
                this._subscribers.splice(idx, 1);
            }else{
                console.error('Failed to unsubscribe', uuid);
            }
        }
    }

    getURLPath(){
        return this._route || window.location.pathname || window.location.href;
    }

}
