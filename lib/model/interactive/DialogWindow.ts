import {Sprite} from "../rendering/Sprite";
import {Subscribe} from "../subscribe/Subscribe";


export class DialogWindow {
    element: HTMLElement;
    _subscribe = new Subscribe();

    constructor(character_image: string, text: string, options?) {
        this.element = document.createElement("div");
        this.element.className = "dialog-window flex";
        if (!options){
            options = [];
        }

        let display_image = document.createElement("div");
        display_image.className="display-image";
        let image = document.createElement("img");
        image.src = character_image;
        display_image.appendChild(image);
        this.element.appendChild(display_image);


        let display_text = document.createElement("div");
        display_text.className="display-text";
        let limits = document.createElement("div");
        limits.className="container";
        limits.innerText = text;
        display_text.appendChild(limits);
        this.element.appendChild(display_text);

        //this.element.innerHTML = (app.render(DialogWindowView, {image: character_image, text, options}, ejs.render))
        if (options.length) {
            let limits = document.createElement("div");
            limits.className="container";
                for (const prop of options) {
                    let btn = document.createElement("button");
                    btn.innerText = prop;
                    limits.appendChild(btn);
            }


            display_text.appendChild(limits);


        }

       /* let _w = document.getElementById("hero") || document.querySelector(".hero");
        _w.appendChild(this.element);
        window.setTimeout(()=>{
            this.element.style.bottom = "0px";
        },1);*/
    }

    getElement(){
        return this.element;
    }

    subscribe(slug: string, fn): any {
        this._subscribe.subscribe(slug, fn);
    }

    publish(packet, data) {
        this._subscribe.publish(packet, data);
    }
}
