import {Project} from "../Project";
import {Account} from "./Account";
import {CacheModel} from "./Cache";

export class State {
    public account: Account;
    public projects: Project[];
    public listeners;
    private history;
    _v;

    constructor(props?) {
        this.history = [];
        this.listeners = [];
        if (props) {
            this.deserialize(props);
        }
    }

    load = () => {
        if (window.localStorage.getItem('oakframe-state')) {
            this.deserialize(JSON.parse(window.localStorage.getItem('oakframe-state')))
        } else {
            console.log("NO LOCAL STATE FOUND");
        }
    };

    deserialize = (props?) => {
        if (props) {
            props.account ? this.account = new Account(props.account) : 0;
        }
    };

    serialize = () => {
        return JSON.stringify(this);
    }

    mutate(key, value) {
        if (this.listeners[key]) {
        }
        window.localStorage.setItem('oakframe-state', JSON.stringify(this));
    }

    listenKey(key, fn) {
        this.listeners[key] = fn;
    }

    clearKey(key) {
        this.listeners[key] = null;
    }
}