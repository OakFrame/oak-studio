export class Timeline {
    events: TimelineEvent[];
    index: number;
}

interface TimelineOptions {
    timeout?:number;
    wait_for_completion?:boolean;
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
    constructor(props?:TimelineOptions) {
        super(props);
    }

}

export class PathTimelineEvent extends TimelineEvent {
    constructor(props?:TimelineOptions) {
        super(props);

    }

}
export class DialogTimelineEvent extends TimelineEvent {
    constructor(props?:TimelineOptions) {
        super(props);

    }

}