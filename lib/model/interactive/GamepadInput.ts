import {Vec2} from "../math/Vec2";

export class GamepadInput {

    gamepads;

    constructor() {

        this.gamepads = [];

        window.addEventListener(
            "gamepadconnected",
            (e) => {
                this.gamepadHandler(e, true);
            },
            false
        );
        window.addEventListener(
            "gamepaddisconnected",
            (e) => {
                this.gamepadHandler(e, false);
            },
            false
        );

    }

    gamepadHandler(event, connecting) {
        const gamepad = event.gamepad;
        // Note:
        // gamepad === navigator.getGamepads()[gamepad.index]

        if (connecting) {
            this.gamepads[gamepad.index] = gamepad;
            console.log(
                "Gamepad connected at index %d: %s. %d buttons, %d axes.",
                gamepad.index,
                gamepad.id,
                gamepad.buttons.length,
                gamepad.axes.length
            );
        } else {
            delete this.gamepads[gamepad.index];
        }
    }

getLowestId(){
        if (!navigator.getGamepads){return 0;}
        let l = 999;
    let gamepads = navigator.getGamepads();
    gamepads.forEach((g)=>{
        if (g){
            if (g.index){
                if (g.index < l){
                    l = g.index;
                }
            }
        }
    });
    return l;
}


    getButtonStatus(index:number){
        if (!this.gamepads[index] || !navigator.getGamepads){return []};
        var gamepads = navigator.getGamepads();
        return gamepads[index].buttons;

    }

    getAnalogLeft(index:number){
        if (!this.gamepads[index] || !navigator.getGamepads){return new Vec2()};
        var gamepads = navigator.getGamepads();

        let axes = gamepads[index].axes;
        return Vec2.fromValues((axes[0]),(axes[1]));
    }

    getAnalogRight(index:number){
        if (!this.gamepads[index] || !navigator.getGamepads){return new Vec2()};
        var gamepads = navigator.getGamepads();

        let axes = gamepads[index].axes;
        return Vec2.fromValues((axes[2]),(axes[3]));
    }


}
