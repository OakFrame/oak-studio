import {Vec3} from "../math/Vec3";
import {DialogWindow} from "./DialogWindow";
import {Sprite} from "../rendering/Sprite";
import {Room} from "oak-studio/lib/model/interactive/Room";
import {GameEventEmitter} from "oak-studio/lib/model/interactive/GameEvent";

const synth = window['speechSynthesis'];
let utterance = new window['SpeechSynthesisUtterance']();
var voices = window.speechSynthesis.getVoices();
utterance.voice = voices[10]; // Note: some voices don't support altering params
//utterance.voiceURI = 'native';
utterance.text = ' ';
utterance.lang = 'en-US';

function synthVoice(text, cb, voice?) {
    utterance = new window['SpeechSynthesisUtterance'](text);
    voices = window.speechSynthesis.getVoices();
    utterance.voice = voices[10];
    utterance.volume = 1; // 0 to 1
    utterance.rate = 0.8;//0.8; // 0.1 to 10
    utterance.pitch = 1.1; //0 to 2
    //utterance.rate = 1.2;

    if (voice) {
        switch (voice) {
            case "wolfe":
                utterance.volume = 1; // 0 to 1
                utterance.rate = 2;//0.8; // 0.1 to 10
                utterance.pitch = 1.1; //0 to 2
                break;
            case "mowser":
                utterance.volume = 1.2; // 0 to 1
                utterance.rate = 1.7;//0.8; // 0.1 to 10
                utterance.pitch = 0.5; //0 to 2
                break;

                case "narrator":
                utterance.voice = voices[1];
                utterance.volume = 1; // 0 to 1
                utterance.rate = 1.2;//0.8; // 0.1 to 10
                utterance.pitch = 0.5; //0 to 2
                break;

                case "28":
                utterance.voice = voices[28];
                utterance.volume = 1; // 0 to 1
                utterance.rate = 1.2;//0.8; // 0.1 to 10
                utterance.pitch = 1; //0 to 2
                break;

                case "11":
                utterance.voice = voices[11];
                utterance.volume = 1; // 0 to 1
                utterance.rate = 1.2;//0.8; // 0.1 to 10
                utterance.pitch = 1; //0 to 2
                break;
                case "49":
                utterance.voice = voices[49];
                utterance.volume = 1; // 0 to 1
                utterance.rate = 1.2;//0.8; // 0.1 to 10
                utterance.pitch = 1; //0 to 2
                break;
                case "4":
                utterance.voice = voices[4];
                utterance.volume = 1; // 0 to 1
                utterance.rate = 1;//0.8; // 0.1 to 10
                utterance.pitch = 1; //0 to 2
                break;    case "5":
                utterance.voice = voices[5];
                utterance.volume = 1; // 0 to 1
                utterance.rate = 1;//0.8; // 0.1 to 10
                utterance.pitch = 1; //0 to 2
                break;


        }
    }

    let regex = /(&nbsp;|<([^>]+)>)/ig
        ,   result = text.replace(regex, "")

    utterance.text = result;
    synth.speak(utterance);

    utterance.onend = function (evt) {
        cb(evt);
    }
}

export class Timeline {
    events: TimelineEvent[];
    index: number;

    constructor() {
        this.index = 0;
        this.events = [];
    }
}

interface TimelineEventOptions {
    timeout?: number;
    wait_for_completion?: boolean;
}

interface DialogTimelineOptions extends TimelineEventOptions {
    image?: string,
    text: string,
    options?: string[]
    voice?: string;
}

interface ActorTimelineOptions extends TimelineEventOptions {
    sprite?: Sprite,
    focus: string,
    scale?: Vec3,
    reset?: boolean
}

interface CameraTimelineOptions extends TimelineEventOptions {
    from?: Vec3;
    to?: Vec3;
    focus?: string;
    reset?: boolean;
    zoom?: number;
}

interface PathTimelineOptions extends TimelineEventOptions {
    to?: Vec3;
    add?: Vec3;
    focus?: string;
    target?: string;
    verb?: string;
}

interface TextTimelineOptions extends TimelineEventOptions {
    text: string,
    options?: string[];
    center?: boolean;
}

interface DialogTimelineOptions extends TimelineEventOptions {
    text: string,
    options?: string[]
}

export class TimelineEvent {
    finished: boolean = false;
    type_name: string;
    timeout: number;
    wait_for_completion: boolean;

    constructor(props?) {
        if (props) {
            this.timeout = props.timeout || 0;
            this.wait_for_completion = props.wait_for_completion || false;
        }
    }

    start(emitter?: GameEventEmitter, room?: Room) {

    }

    done(emitter?: GameEventEmitter, room?: Room) {

    }

    update(emitter?: GameEventEmitter, room?: Room, time_remaining?: number) {

    }
}


export class CameraTimelineEvent extends TimelineEvent {
    type_name: string = "camera";
    from: Vec3;
    to: Vec3;
    focus: string;
    reset: boolean;
    zoom:number;

    constructor(props?: CameraTimelineOptions) {
        super(props);
        this.from = props.from;
        this.to = props.to;
        this.focus = props.focus;
        this.reset = props.reset;
        this.zoom = props.zoom;
    }

    start(emitter, room?) {


        if (this.focus) {
            emitter.publish('camera.focus', {focus:this.focus, zoom:this.zoom});
        }
        if (this.from) {
            emitter.publish('camera.set.from', this.from);
        }
        if (this.to) {
            emitter.publish('camera.set.to', this.to);
        }
        if (this.reset) {
            emitter.publish('camera.reset', this.reset);
        }

        console.log('emit', "camera", this.focus, this.from, this.to);
    }

    done(emitter) {
        //emitter.publish('camera.reset');
    }

}

export class ActorTimelineEvent extends TimelineEvent {
    type_name: string = "actor";
    sprite: Sprite;
    scale: Vec3;
    focus: string;
    reset: boolean;

    constructor(props?: ActorTimelineOptions) {
        super(props);
        this.sprite = props.sprite;
        this.focus = props.focus;
        this.reset = props.reset;
        this.scale = props.scale;
    }

    start(emitter, room?) {


        if (this.focus) {
            let focus;
            room.findItems(this.focus).forEach((ob) => {
                if (this.sprite) {
                    ob.sprite = this.sprite;
                }

                if (this.scale) {
                    ob.scale.copy(this.scale);
                }
            });
        }
        if (this.reset) {
            //  emitter.publish('camera.reset', this.reset);
        }

        // console.log('emit', "camera", this.focus, this.from, this.to);
    }

    done(emitter) {
        //emitter.publish('camera.reset');
    }

}

export class PathTimelineEvent extends TimelineEvent {
    type_name: string = "path";
    to: Vec3;
    add: Vec3;
    focus: string;
    target: string;
    sent: boolean = false;
    verb: string;

    constructor(props?: PathTimelineOptions) {
        super(props);
        this.target = props.target;
        this.to = props.to;
        this.add = props.add;
        this.focus = props.focus;
        this.verb = props.verb;
    }

    start(emitter, room) {
        this.sent = false;
        let content = document.getElementById('content')


        let target;
        room.findItems(this.target).forEach((ob) => {
            target = ob;
        });

        if (!target) {
            this.finished = true;
            return;
        }

        if (!this.verb) {
            return;
        }

        let p = document.createElement('div');
        p.className = "body-text container";
        p.innerHTML = `<p class="bubble-container"><span class="bubble" style="color:${target.primary_color || "#000"};background-color:#fff;">${this.verb}</span><span class="bubble" style="color:#fff;background-color:${target.primary_color || "#000"};">${target.name}</span></p>`;
        // this.elem = p;

        let nodes: HTMLCollection = content.children;

        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i].className.includes("fade-away")) {
                nodes[i].className += " fade-away-regular";
            }
        }

        content.appendChild(p);
    }

    update(emitter, room, remaining) {

        if (remaining < 5000 && !this.sent) {
            this.sent = true;
            if (this.focus && this.target) {
                emitter.publish('path.focus', {focus: this.focus, target: this.target});
            }
            if (this.focus && this.to) {
                emitter.publish('path.to', {focus: this.focus, to: this.to});
                return;
            }
            if (this.focus && this.add) {
                emitter.publish('path.add', {focus: this.focus, add: this.add});
                return;
            }
        }

        let focus;
        room.findItems(this.focus).forEach((ob) => {
            focus = ob;
        });

        if (!focus) {
            return
        }

        let target;
        room.findItems(this.target).forEach((ob) => {
            target = ob;
        });

        let path_pos;
        if (target) {
            path_pos = target.position.clone();
        } else {
            path_pos = this.to || this.add;
        }

        if (focus && path_pos) {
            //console.log(focus.position.dist(path_pos));
            if (focus.position.dist(path_pos) < 5.25) {
                this.finished = true;
            }


        } else {
            this.finished = true;
        }
    }

    done(emitter, room) {
        if (this.focus) {
            let focus;
            room.findItems(this.focus).forEach((ob) => {
                focus = ob;
            });
            if (focus) {
                focus.path = focus.path.clone();
            }
        }
        //emitter.publish('camera.reset');
    }

}

export class TextTimelineEvent extends TimelineEvent {
    text: string;
    center: boolean;
    type_name: string = "title";

    constructor(props?: TextTimelineOptions) {
        super(props);
        this.text = props.text;
        this.center = props.center || false;
    }

    start() {
        console.log('STARTING TEXT TIMELINE EVENT');
        let hero = document.getElementsByClassName('navbar')[0];

        let p = document.createElement('div');
        p.className = "timeline-text container" + (this.center ? " flex align-center text-center" : "");
        p.innerHTML = `<div style="width: 100%;">${this.text}</div>`;
        p.style.width = "100%";
        p.style.height = (window.innerHeight - 100) + "px";

        function insertAfter(newNode, existingNode) {
            existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
        }

        insertAfter(p, hero);
        window.setTimeout(()=>{
            p.className+=" transition";

        }, 10)
    }

    done() {
        let elem =
            document.getElementsByClassName("timeline-text")[0];
        elem.parentNode.removeChild(elem);
    }

}

export class BodyTextTimelineEvent extends TimelineEvent {
    type_name: string = "text";
    text: string;
    elem;

    constructor(props?: TextTimelineOptions) {
        super(props);
        this.text = props.text;
        this.timeout = props.timeout || this.timeout || (Math.min(this.text.length * 50, 5000));
    }

    start() {
        console.log('STARTING BoDY TEXT TIMELINE EVENT');
        let content = document.getElementById('content')

        let p = document.createElement('div');
        p.className = "body-text container";
        p.innerHTML = `<p>${this.text}</p>`;
        this.elem = p;

        let nodes: HTMLCollection = content.children;

        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i].className.includes("fade-away")) {
                nodes[i].className += " fade-away-regular";
            }
        }

        content.appendChild(p);

      //  synthVoice(this.text, () => {
            //this.finished = true;
       // }, "narrator")
    }

    done() {
        //this.elem.parentNode.removeChild(this.elem);
    }

}

export class WaitTimelineEvent extends TimelineEvent {
    type_name: string = "wait";

    constructor(props?: TimelineEventOptions) {
        super(props);
    }

}

export class DialogTimelineEvent extends TimelineEvent {
    type_name: string = "talk";
    text: string;
    image: string;
    voice: string;
    options: string[];
    elem;

    constructor(props?: DialogTimelineOptions) {
        super(props);
        this.image = props.image;
        this.text = props.text;
        this.options = props.options;
        this.voice = props.voice;
    }

    start() {
        this.elem = new DialogWindow(this.image, this.text, this.options);
        let content = document.getElementById('content');
        let nodes: HTMLCollection = content.children;

        for (let i = 0; i < nodes.length; i++) {
            if (!nodes[i].className.includes("fade-away")) {
                nodes[i].className += " fade-away-regular";
            }
        }

        content.appendChild(this.elem.getElement());
        document.getElementsByClassName('content-container')[0].scrollTop = 1000000;

        if (this.voice) {
            synthVoice(this.text.split(" ").map((v)=>{
               return v;//v.slice(0,2+Math.floor(Math.random()*2));
            }).join(" "), () => {
                this.finished = true;
            }, this.voice)
        }

    }

    done() {
        //this.elem.getElement().parentNode.removeChild(this.elem.getElement());
    }

}
