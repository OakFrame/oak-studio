import {Timeline, TimelineEvent} from "./Timeline";
import {GameEventEmitter} from "./GameEvent";
import { Room } from "oak-studio/lib/model/interactive/Room";

export class TimelineRunner {
    timeline: Timeline;
    event: TimelineEvent;
    position: number;
    timer: number;
    emitter:GameEventEmitter;

    constructor() {
        this.emitter = new GameEventEmitter();
    }

    useTimeline(t) {
        this.timeline = t;
        this.position = 0;
        this.timer = 0;
        this.event = null;
        console.log('USING NEW TIMELINE', t);
    }

    update(room?:Room) {
        if (!this.event) {
            this.event = this.timeline.events[this.position];
            this.timer = Date.now();
            if (this.event) {
                this.event.start(this.emitter, room);
            }
        }

        if (!this.event) {
            return;
        }

        this.event.update(this.emitter, room, (this.timer + this.event.timeout) - Date.now());

        if (this.event.finished || (this.event.wait_for_completion && Date.now() > this.timer + this.event.timeout)  || (!this.event.wait_for_completion)) {
            this.next(room);
        }
    }

    next(room) {
        if (this.event){
            this.event.done(this.emitter, room);
        }
        this.event = null;
        this.position++;
    }

}
