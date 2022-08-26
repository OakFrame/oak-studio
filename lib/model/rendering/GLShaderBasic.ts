import shaderPositionColorVertex from "./shader/shaderPositionColorVertex.glsl";
import shaderPositionColorFragment from "./shader/shaderPositionColorFragment.glsl";

import shaderPositionColorGouraudVertex from "./shader/shaderPositionColorGouraudVertex.glsl";
import shaderPositionColorGouraudFragment from "./shader/shaderPositionColorGouraudFragment.glsl";

import shaderTextureVertex from "./shader/textureVertex.glsl";
import shaderTextureFragment from "./shader/textureFragment.glsl";

import cameraShadowVertex from "./shader/cameraShadowVertex.glsl";
import cameraShadowFragment from "./shader/cameraShadowFragment.glsl";

import lightBufferVertex from "./shader/lightBufferVertex.glsl";
import lightBufferFragment from "./shader/lightBufferFragment.glsl";

export interface GLShader {
    vertexShader: string;
    fragmentShader: string;
    vertexAttributeNames?: {
        position: string;
        color?: string;
        normal?: string;
        uv?: string;
    }
}


export class GLShaderBasic implements GLShader {
    vertexShader = shaderPositionColorVertex;
    fragmentShader = shaderPositionColorFragment;
    vertexAttributeNames = {
        position: "vertPosition",
        color: "vertColor",
        // normal:"vertNormal",
        // uv:"vertUV",
    };
}

export class GLShaderTexture implements GLShader {
    vertexShader = shaderTextureVertex;
    fragmentShader = shaderTextureFragment;
}

export class GLPositionColorGouraudShader implements GLShader {
    vertexShader = shaderPositionColorGouraudVertex;
    fragmentShader = shaderPositionColorGouraudFragment;
}

export class GLCameraShadowTextureShader implements GLShader {
    vertexShader = cameraShadowVertex;
    fragmentShader = cameraShadowFragment;
}

export class GLLightShadowTextureShader implements GLShader {
    vertexShader = lightBufferVertex;
    fragmentShader = lightBufferFragment;
}
