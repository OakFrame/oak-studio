import {Provider} from "../../interface/Provider";
import {ApplicationRouter} from "../ApplicationRouter";

export class Module {

	/** Fast interface to determine if module has been initialized **/
	private _initialized: boolean = false;
	private _state_history;
	public loop;
	public _binds=[];

	public init = ():any => {};

	public update = ():any => {
	//	if (JSON.stringify(this._state_history) !== JSON.stringify())
	};

	public focus = (app?:ApplicationRouter):any => {
		let self = this;
		this.loop = window.setInterval(function () {
			self.update();
		}, (1000 / 24) | 0);
	};

	public defocus = ():any => {
		window.clearInterval(this.loop)
	};

	public render = ():any => {};

	isInitialized(): boolean {
		return this._initialized;
	}

	public use = (app?:ApplicationRouter):any => {};

}