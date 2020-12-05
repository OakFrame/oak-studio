import {Vec2} from "../lib/model/math/Vec2";
import {Vec3} from "../lib/model/math/Vec3";
import {Sprite} from "../lib/model/rendering/Sprite";
import {Surface} from "../lib/model/rendering/Surface";
import {SHIPP} from "../lib/model/SHIPP";
import {RGB, RGBA} from "../lib/model/RGB";
import {AssetLoader} from "../lib/model/AssetLoader";

const oak = {
    Math:{
        Vec2:Vec2,
        Vec3:Vec3,
        SHIPP:SHIPP
    },
    Rendering: {
        Surface:Surface,
        Sprite:Sprite
    },
    Color:{
        RGB:RGB,
        RGBA:RGBA
    },
    Utils:{
        AssetLoader:AssetLoader
    }
};