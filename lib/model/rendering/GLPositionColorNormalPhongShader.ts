import shaderPositionColorNormalPhongVertex from "./shader/shaderPositionColorNormalGouraudNormal.glsl";
import shaderPositionColorNormalPhongFragment from "./shader/shaderPositionColorNormalGouraudFragment.glsl";
import {GLShader} from "./GLShader";

export class GLPositionColorNormalPhongShader implements GLShader {
    vertexShader = shaderPositionColorNormalPhongVertex;
    fragmentShader = shaderPositionColorNormalPhongFragment;
    vertexAttributeNames = {
        position: "vertPosition",
        color: "vertColor",
        normal: "vertNormal"
    };
}
