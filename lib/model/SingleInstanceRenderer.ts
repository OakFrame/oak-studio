import {MD5} from "./MD5";

export class SingleInstanceRenderer {

    hashMap: any;
    loop: any;
    app;
    ejs;
    id;
    view;
    data;
    cb;
    ids: string[];
    cbs: any;

    constructor() {
        this.hashMap = [];
        this.ids = [];
        this.cbs = {};
    }

    focus() {

        if (!this.loop) {
            this.loop = window.setInterval(async () => {


                this.ids.forEach((id) => {
                   // console.log('loop', id, this.ids, this.cbs);

                    if (id && !document.getElementById(id)) {
                        //  window.clearInterval(this.loop[id]);
                        //this.loop[id] = null;
                        let idx = this.ids.indexOf(id);
                        if (idx !== -1) {
                           // this.ids = [...this.ids.splice(idx, 1)];
                            delete this.cbs[id];
                        }
                    }
                    if (id && document.getElementById(id)){
                        if (this.cbs[id] && document.getElementById(id)) {
                            this.cbs[id]();
                        }
                    }
                })


            }, 125);
        }

        //this.loop = [];
    }


    async renderToElement(app, ejs, id: string, view: string, data: any, cb: any) {
        let _data = await data();
        const rendered = (app.render(view, _data, ejs.render));
        const datahash = MD5(rendered);
        let ex = document.getElementById(id);
        if (ex.innerHTML === "" || !this.hashMap[id] || this.hashMap[id] !== datahash) {
            // console.log("updated HTML", id, view, data);
            ex.innerHTML = rendered;
            this.hashMap[id] = datahash;
            cb(_data);
            console.log('updated data map id', id);
        }
        if (this.ids.indexOf(id) == -1) {
            console.log('setup id', id);
            this.ids.push(id);
        }
        this.cbs[id] = async ()=>{
           // console.log('CALLBACK', id);
            await this.renderToElement(app,ejs,id, view, data, cb);
        };
    }
}
