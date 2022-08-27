import shaderPositionColorNormalPhongVertex from "./shader/shaderPositionColorNormalPhongVertex.glsl";
import shaderPositionColorNormalPhongFragment from "./shader/shaderPositionColorNormalPhongFragment.glsl";
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
