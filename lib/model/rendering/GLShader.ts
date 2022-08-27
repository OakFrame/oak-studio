//import cameraShadowVertex from "./shader/cameraShadowVertex.glsl";
//import cameraShadowFragment from "./shader/cameraShadowFragment.glsl";

//import lightBufferVertex from "./shader/lightBufferVertex.glsl";
//import lightBufferFragment from "./shader/lightBufferFragment.glsl";

export interface GLShader {
    _program?;
    vertexShader: string;
    fragmentShader: string;
    vertexAttributeNames?: {
        position: string;
        color?: string;
        normal?: string;
        uv?: string;
    }
    vertexUniformNames?;
}

/*
export class GLCameraShadowTextureShader implements GLShader {
    vertexShader = cameraShadowVertex;
    fragmentShader = cameraShadowFragment;
}

export class GLLightShadowTextureShader implements GLShader {
    vertexShader = lightBufferVertex;
    fragmentShader = lightBufferFragment;
}
*/