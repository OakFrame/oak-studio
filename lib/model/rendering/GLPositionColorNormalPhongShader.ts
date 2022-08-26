import shaderPositionColorPhongVertex from "*.glsl";
import shaderPositionColorPhongFragment from "*.glsl";
import {GLShader} from "./GLShader";

export class GLPositionColorNormalPhongShader implements GLShader {
    vertexShader = shaderPositionColorPhongVertex;
    fragmentShader = shaderPositionColorPhongFragment;
    vertexAttributeNames = {
        position: "vertPosition",
        color: "vertColor",
        normal: "vertNormal"
    };
}
