import shaderPositionColorVertex from "./shader/shaderPositionColorVertex.glsl";
import shaderPositionColorFragment from "./shader/shaderPositionColorFragment.glsl";
import {GLShader} from "./GLShader";

export class GLPositionColorShader implements GLShader {
    vertexShader = shaderPositionColorVertex;
    fragmentShader = shaderPositionColorFragment;
    vertexAttributeNames = {
        position: "vertPosition",
        color: "vertColor"
    };
}
