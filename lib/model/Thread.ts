import {Field} from "./Field";

export class ThreadBlock {

    constructor(type, value) {
        return {"type": type || "any", "value": value || "", "size": "full"}
    }

}


export class Thread {

    _id;
    members;
    title: String;
    body: String;
    cta: String;
    owner: String;
    size: String;

    messages;
    blocks: ThreadBlock[] = [];
    category: String;
    created;


}