import shaderPositionNormalVertex from "./shader/shaderPositionNormalVertex.glsl";
import shaderPositionNormalFragment from "./shader/shaderPositionNormalFragment.glsl";
import {GLShader} from "./GLShader";

export class GLPositionNormalShader implements GLShader {
    vertexShader = shaderPositionNormalVertex;
    fragmentShader = shaderPositionNormalFragment;
    vertexAttributeNames = {
        position: "vertPosition",
        //color: "vertColor",
        normal: "vertNormal"
    };
}
