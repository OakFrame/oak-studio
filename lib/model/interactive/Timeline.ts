import {Sprite} from "../rendering/Sprite";

export class Timeline {
    events: TimelineEvent[];
    index: number;
    constructor() {
        this.index = 0;
        this.events = [];
    }
}

interface TimelineEventOptions {
    timeout?:number;
    wait_for_completion?:boolean;
}

interface DialogTimelineOptions extends TimelineEventOptions{
    sprite?:Sprite,
    text:string,
    options?:string[]
}

export class TimelineEvent {
    timeout:number;
    wait_for_completion:boolean;
    constructor(props?) {

    }
    start(){

    }
    update(){

    }
}

export class WaitTimelineEvent extends TimelineEvent {
    constructor(props?:TimelineEventOptions) {
        super(props);
    }

}

export class PathTimelineEvent extends TimelineEvent {
    constructor(props?:TimelineEventOptions) {
        super(props);

    }

}
export class DialogTimelineEvent extends TimelineEvent {
    constructor(props?:DialogTimelineOptions) {
        super(props);

    }

}