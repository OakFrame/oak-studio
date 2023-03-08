precision highp float;

const int TEXTURE_LOOKUP = 0;

varying vec4 fragColor;
varying vec3 vNormal;
varying vec3 cNormal;
varying vec3 vPosition;
varying vec4 vColor;
varying vec3 mNormal;

uniform mat4 mWorld;
uniform mat4 mProj;
uniform mat4 sWorld;
uniform mat4 sProj;

uniform float fTime;
uniform mat4 mProp;

varying vec4 shadowPos;
uniform sampler2D depthColorTexture;
const mat4 texUnitConverter = mat4(0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.5, 0.5, 0.5, 1.0);

//float visibility = 0; for (ray = 0 .. 31) {   float3 dir = ray_dir[ray];
// From constant buffer   float this_ray_visibility = 1;   // Short-range samples from density volume:   for (step = 1 .. 16)   // Don't start at zero   {     float d = density_vol.Sample( ws + dir * step );     this_ray_visibility *= saturate(d * 9999);   }   // Long-range samples from density function:   for (step = 1 .. 4)  // Don't start at zero!   {     float d = density_function( ws + dir * big_step );     this_ray_visibility *= saturate(d * 9999);   }   visibility += this_ray_visibility; } return (1 – visibility/32.0); // Returns occlusion


float Ka = 1.0;// Ambient reflection coefficient
float Kd = 1.0;// Diffuse reflection coefficient
float Ks = 1.0;// Specular reflection coefficient
float shininessVal = 20.0;// Shininess

// Material color
vec4 ambientColor = vec4(0.10, 0.01, 0.26, 1.0);
vec4 diffuseColor = vec4(0.0, 0.0, 0.0, 1.0);
vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);

//const vec3 lightPos = vec3(25.0, 25.0, 10.0);// Light position
//const vec3 sunPosition = vec3(25.0, 25.0, 10.0);// Light position

//float lightDistance = length(lightDirection);

/*
vec4 SmoothCurve( vec4 x ) {
    return x * x *( 3.0 - 2.0 * x );
}
vec4 TriangleWave( vec4 x ) {
    return abs( frac( x + 0.5 ) * 2.0 - 1.0 );
}
vec4 SmoothTriangleWave( vec4 x ) {
    return SmoothCurve( TriangleWave( x ) );
}*/

float lerp(float a, float b, float f){
    return a + f * (b - a);
}

float bias(float b, float x){
    return x / ((1.0 / b - 2.0) * (1.0 - x) + 1.0);
}

float gain(float g, float x){
    float p = (1.0 / g - 2.0) * (1.0 - 2.0 * x);
    if (x < 0.5) return x / (p + 1.0);
    return (p - x) / (p - 1.0);
}

float decodeFloat (vec4 color) {
    const vec4 bitShift = vec4(
    1.0 / (256.0 * 256.0 * 256.0),
    1.0 / (256.0 * 256.0),
    1.0 / 256.0,
    1
    );
    return dot(color, bitShift);
}


float Phong(){

    vec3 lightPos = vec3(25.0, 25.0, 10.0);
    lightPos.x *= sin(fTime/600.0);

    vec3 N = normalize(mNormal);
    vec3 L = normalize(lightPos - vPosition);

    //gl_FragColor = vec4(dot(vNormal, vec3(1.0, 1.0, 1.0)), 1);
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if (lambertian > 0.0) {
        vec3 R = reflect(-L, N);// Reflected light vector
        vec3 V = normalize(-vPosition);// Vector to viewer
        // Compute the specular term
        float specAngle = max(dot(R, V), 0.0);
        specular = pow(specAngle, shininessVal);
    }

    return (
    Kd * lambertian +
    Ks * specular
    );

}

float Rim(){
    //  vec4 rimLight = vec4(vec3(0.0), vColor.a);
    //  vec3 eye = normalize(-vPosition.xyz);
    // float rimLightIntensity = dot(eye, vNormal);
    //rimLightIntensity = 1.0 - rimLightIntensity;
    // rimLightIntensity = max(0.0, rimLightIntensity);

    float rimLight = (1.0 - max(0.0, dot(normalize(mNormal), normalize(vNormal))));
    //  rimLight = pow(rimLight, vec3(2.0)) * 1.2;//( celShadingEnabled.x == 1? smoothstep(0.3, 0.4, rimLight.rgb): pow(rimLight.rgb, vec3(2.0)) * 1.2);
    // rimLight.rgb = smoothstep(0.3, 0.4, rimLight.rgb);
    //rimLight.rgb *= specularColor.rgb;
    //rimLight.rgb = vec3(smoothstep(0.6, 1.0, vdn));
    return rimLight;//(vec4(rimLight.xyz, 1.0));
}

float Phong2(){

    vec3 lightPos = vec3(40000.0, 20000.0, 50000.0);

    vec3 lightDirection = vPosition - lightPos;

    vec3 unitLightDirection = -normalize(lightDirection);
   // vec3 eyeDirection       = normalize(-vPosition);
    //vec3 reflectedDirection = normalize(-reflect(unitLightDirection, vNormal));
  //  vec3 halfwayDirection   = normalize(unitLightDirection + eyeDirection);

    float intensity = clamp(dot(vNormal, unitLightDirection), 0.0, 1.0);//clamp(dot(eyeDirection, reflectedDirection)
    return bias(0.9,intensity);
}

vec4 Specular(){

    vec3 lightPos = vec3(25.0, 25.0, 10.0);

    vec3 lightDirection = vec3(0.0, 0.0, 0.0) - lightPos;

    vec3 unitLightDirection = normalize(lightDirection);
    vec3 eyeDirection       = normalize(-vPosition);
    //vec3 reflectedDirection = normalize(-reflect(unitLightDirection, vNormal));
    vec3 halfwayDirection   = normalize(unitLightDirection + eyeDirection);

    float specularIntensity = clamp(dot(vNormal, halfwayDirection), 0.0, 1.0);//clamp(dot(eyeDirection, reflectedDirection)
    return specularColor * specularIntensity;
}

vec4 AmbientWorldLight(){
    //vec3 worldNormal = normalize(vec4(vNormal,0.0)).xyz;
    //float sunPosition = sin((fTime));
    //float sunMixFactor = 1.0 - (sunPosition / 2.0 + 0.5);
    vec4 ambientCool = vec4(0.302, 0.451, 0.471, 1.0);//pow(vec3(0.302, 0.451, 0.471), vec3(1.0)) * max(0.5, sunMixFactor);
    vec4 ambientWarm = vec4(0.765, 0.573, 0.400, 1.0);//pow(vec3(0.765, 0.573, 0.400), vec3(1.0)) * max(0.5, sunMixFactor);
    vec4 skyLight = mix(ambientWarm, ambientCool, 0.5 * (1.0 + dot(vNormal, vec3(0.0, 0.0, 1.0))));
    //vec3 groundLight = mix(ambientWarm, ambientCool, sunMixFactor);
    //vec3 ambientLight = mix(skyLight,diffuseColor, 0.5 * (1.0 + dot(vNormal, lightPos)));
    return skyLight;
}


/*
float sample2DBicubic(sampler2D tex, vec2 sampleLocation, float texelSize){

    float orig = decodeFloat(texture2D(tex, sampleLocation));
    // transform the coordinate from [0,extent] to [-0.5, extent-0.5]
    vec2 coord_grid = vec2(sampleLocation.x - 0.5, sampleLocation.y - 0.5);
    vec2 index = floor(coord_grid);
    vec2 fraction = coord_grid - index;
    vec2 one_frac = 1.0 - fraction;
    vec2 one_frac2 = one_frac * one_frac;
    vec2 fraction2 = fraction * fraction;
    vec2 w0 = 1.0/6.0 * one_frac2 * one_frac;
    vec2 w1 = 2.0/3.0 - 0.5 * fraction2 * (2.0-fraction);
    vec2 w2 = 2.0/3.0 - 0.5 * one_frac2 * (2.0-one_frac);
    vec2 w3 = 1.0/6.0 * fraction2 * fraction;
    vec2 g0 = w0 + w1;
    vec2 g1 = w2 + w3;
    // h0 = w1/g0 - 1, move from [-0.5, extent-0.5] to [0, extent]
    vec2 h0 = (w1 / g0) - 0.5 + index;
    vec2 h1 = (w3 / g1) + 1.5 + index;
//    h0 -= 0.5;h1-=0.5;
    // fetch the four linear interpolations
    float tex00 = decodeFloat(texture2D(tex, sampleLocation + (vec2(h0.x, h0.y) * texelSize)));
    float tex10 = decodeFloat(texture2D(tex, sampleLocation + (vec2(h1.x, h0.y) * texelSize)));
    float tex01 = decodeFloat(texture2D(tex, sampleLocation + (vec2(h0.x, h1.y) * texelSize)));
    float tex11 = decodeFloat(texture2D(tex, sampleLocation + (vec2(h1.x, h1.y) * texelSize)));
    // weigh along the y-direction
    tex00 = mix(tex01, tex00, g0.y);
    tex10 = mix(tex11, tex10, g0.y);
    // weigh along the x-direction
     //return mix(tex10, tex00, g0.x);
    return orig;
}*/

vec4 cubic(float v){
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    float x = s.x;
    float y = s.y - 4.0 * s.x;
    float z = s.z - 4.0 * s.y + 6.0 * s.x;
    float w = 6.0 - x - y - z;
    return vec4(x, y, z, w) * (1.0/6.0);
}

float textureLinear(sampler2D sampler, vec2 texCoords){
    return decodeFloat(texture2D(sampler, texCoords));
}

float textureBicubic(sampler2D sampler, vec2 texCoords){

    vec2 texSize = vec2(1024.0);
    vec2 invTexSize = 1.0 / texSize;

    texCoords = texCoords * texSize - 0.5;

    vec2 fxy = fract(texCoords);
    texCoords -= fxy;

    vec4 xcubic = cubic(fxy.x);
    vec4 ycubic = cubic(fxy.y);

    vec4 c = texCoords.xxyy + vec2 (-0.5, +1.5).xyxy;

    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + (vec4(xcubic.yw, ycubic.yw)) / s;

    offset *= invTexSize.xxyy;

    float sample0 = decodeFloat(texture2D(sampler, offset.xz));
    float sample1 = decodeFloat(texture2D(sampler, offset.yz));
    float sample2 = decodeFloat(texture2D(sampler, offset.xw));
    float sample3 = decodeFloat(texture2D(sampler, offset.yw));

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);
}

float AmbientOcclusion(){


    vec2 poissonDisk[8];
    poissonDisk[0] = vec2(-0.4096107, 0.8411095);
    poissonDisk[1] = vec2(0.6849564, -0.4990818);
    poissonDisk[2] = vec2(-0.874181, -0.04579735);
    poissonDisk[3] = vec2(0.06407013, 0.05409927);
    poissonDisk[4] = vec2(0.7366577, 0.5789394);
    poissonDisk[5] = vec2(-0.6270542, -0.5320278);
    poissonDisk[6] = vec2(0.9989998, 0.0009880066);
    poissonDisk[7] = vec2(-0.004920578, -0.9151649);

    float occlusion = 0.0;
    float occlusionSamples = 0.0;

    float depthAcneRemover = 0.01;
    vec3 fragmentDepth = shadowPos.xyz;
    fragmentDepth.z -= depthAcneRemover;
    float texelSize = 1.0 / 512.0;

    float heightFactor = clamp((vPosition.z) / 4.0, 0.0, 1.0);
    float upFactor = 0.5 * (1.0 + dot(-vNormal, vec3(0.0, 0.0, 1.0)));
    vec2 sampleLocation = fragmentDepth.xy;
    // for (int x = -1; x <= 1; x++) {
    for (int i = 0; i < 1; i++) {
        sampleLocation += (poissonDisk[i] * ((texelSize) * (2.0+(heightFactor*2.0))));
        float texelDepth = (TEXTURE_LOOKUP == 0) ? textureLinear(depthColorTexture, sampleLocation) : (textureBicubic(depthColorTexture, sampleLocation));
        //if (fragmentDepth.z > texelDepth) {
        //  (1.0 - clamp( normalize(fragmentDepth.z - texelDepth), 0.0, 1.0) )
        occlusion +=  (max(
        ((1.0 - clamp(normalize(fragmentDepth.z - texelDepth), 0.0, 1.0)) * 0.125) - (bias(0.9, upFactor)) - heightFactor,
        max(
        heightFactor,
        1.0 - bias(0.8, upFactor)
        )) * 0.25);
        //}
        // occlusionSamples += 1.0;
    }

    return clamp((1.0 - (occlusion)), 0.0, 1.0);

}

float Edge(){ // Kinda like AO bbut exxaggeraest pixel distances

    vec2 poissonDisk[8];
    poissonDisk[0] = vec2(0.06407013, 0.05409927);
    poissonDisk[1] = vec2(0.7366577, 0.5789394);
    poissonDisk[2] = vec2(-0.6270542, -0.5320278);
    poissonDisk[3] = vec2(-0.4096107, 0.8411095);
    poissonDisk[4] = vec2(0.6849564, -0.4990818);
    poissonDisk[5] = vec2(-0.874181, -0.04579735);
    poissonDisk[6] = vec2(0.9989998, 0.0009880066);
    poissonDisk[7] = vec2(-0.004920578, -0.9151649);

    float occlusion = 0.0;
    float occlusionSamples = 0.0;

    float depthAcneRemover = -0.01;
    vec3 fragmentDepth = shadowPos.xyz;
    fragmentDepth.z -= depthAcneRemover;
    float texelSize = 1.0 / 1024.0;
    // for (int x = -1; x <= 1; x++) {
    for (int i = 0; i < 1; i++) {
        vec2 sampleLocation = fragmentDepth.xy + (poissonDisk[i] * ((texelSize) *  2.0));
        float texelDepth = (TEXTURE_LOOKUP == 0) ? textureLinear(depthColorTexture, sampleLocation) : (textureBicubic(depthColorTexture, sampleLocation));
        if (fragmentDepth.z > texelDepth) {
            occlusion += bias(0.99, clamp(normalize(fragmentDepth.z - texelDepth)*20.0, 0.0, 1.0));
        }
        occlusionSamples += 1.0;
    }

    return clamp((1.0 - (occlusion / occlusionSamples)), 0.0, 1.0);
}

float OrthoLight(int samples){

    vec2 poissonDisk[32];
    poissonDisk[0] = vec2(0.06407013, 0.05409927);
    poissonDisk[1] = vec2(0.7366577, 0.5789394);
    poissonDisk[2] = vec2(-0.6270542, -0.5320278);
    poissonDisk[3] = vec2(-0.4096107, 0.8411095);
    poissonDisk[4] = vec2(0.6849564, -0.4990818);
    poissonDisk[5] = vec2(-0.874181, -0.04579735);
    poissonDisk[6] = vec2(0.9989998, 0.0009880066);
    poissonDisk[7] = vec2(-0.004920578, -0.9151649);
    poissonDisk[8] = vec2(0.1805763, 0.9747483);
    poissonDisk[9] = vec2(-0.2138451, 0.2635818);
    poissonDisk[10] = vec2(0.109845, 0.3884785);
    poissonDisk[11] = vec2(0.06876755, -0.3581074);
    poissonDisk[12] = vec2(0.374073, -0.7661266);
    poissonDisk[13] = vec2(0.3079132, -0.1216763);
    poissonDisk[14] = vec2(-0.3794335, -0.8271583);
    poissonDisk[15] = vec2(-0.203878, -0.07715034);
    poissonDisk[16] = vec2(0.5912697, 0.1469799);
    poissonDisk[17] = vec2(-0.88069, 0.3031784);
    poissonDisk[18] = vec2(0.5040108, 0.8283722);
    poissonDisk[19] = vec2(-0.5844124, 0.5494877);
    poissonDisk[20] = vec2(0.6017799, -0.1726654);
    poissonDisk[21] = vec2(-0.5554981, 0.1559997);
    poissonDisk[22] = vec2(-0.3016369, -0.3900928);
    poissonDisk[23] = vec2(-0.5550632, -0.1723762);
    poissonDisk[24] = vec2(0.925029, 0.2995041);
    poissonDisk[25] = vec2(-0.2473137, 0.5538505);
    poissonDisk[26] = vec2(0.9183037, -0.2862392);
    poissonDisk[27] = vec2(0.2469421, 0.6718712);
    poissonDisk[28] = vec2(0.3916397, -0.4328209);
    poissonDisk[29] = vec2(-0.03576927, -0.6220032);
    poissonDisk[30] = vec2(-0.04661255, 0.7995201);
    poissonDisk[31] = vec2(0.4402924, 0.3640312);

    float shadowAcneRemover = 0.003;
    vec3 fragmentDepth = shadowPos.xyz;
    fragmentDepth.z -= shadowAcneRemover;


    float texelSize = 1.0 / 1024.0;
    float amountInLight = 0.0;
    float lightSamples = 0.0;

    // for (int x = -1; x <= 1; x++) {
    for (int i = 0; i < 4; i++) {

        vec2 sampleLocation = fragmentDepth.xy + (poissonDisk[i] * texelSize);

        float texelDepth = (TEXTURE_LOOKUP == 0) ? textureLinear(depthColorTexture, sampleLocation) : (textureBicubic(depthColorTexture, sampleLocation));

        if (fragmentDepth.z < texelDepth) {
            amountInLight += 1.0;
        }
        lightSamples+=1.0;

    }
    // }
    amountInLight /= lightSamples;
    //amountInLight = floor(amountInLight+0.5);//gain(0.025, amountInLight);
    return amountInLight;//vec4(amountInLight * specularColor, 1.0);
}

vec4 aces_tonemap(vec4 color){
    mat3 m1 = mat3(
    0.59719, 0.07600, 0.02840,
    0.35458, 0.90834, 0.13383,
    0.04823, 0.01566, 0.83777
    );
    mat3 m2 = mat3(
    1.60475, -0.10208, -0.00327,
    -0.53108, 1.10813, -0.07276,
    -0.07367, -0.00605, 1.07602
    );
    vec3 v = m1 * color.rgb;
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return vec4(pow(clamp(m2 * (a / b), 0.0, 1.0), vec3(1.0 / 2.2)),1);
}



vec4 retro_tonemap(vec4 color) {
    float gamma = 2.2;
    float exposure = 1.0;
    float saturation = 1.2;
    float vibrance = 0.5;

    // Apply gamma correction
    vec3 adjustedColor = pow(color.rgb, vec3(1.0/gamma));

    // Apply exposure
    adjustedColor *= exposure;

    // Apply saturation
    float luminance = dot(vec3(0.2126, 0.7152, 0.0722), adjustedColor);
    adjustedColor = mix(vec3(luminance), adjustedColor, saturation);

    // Apply vibrance
    float average = (adjustedColor.r + adjustedColor.g + adjustedColor.b) / 3.0;
    float mx = max(adjustedColor.r, max(adjustedColor.g, adjustedColor.b));
    float amt = (mx - average) * (-vibrance * 3.0);
    adjustedColor.rgb = mix(adjustedColor.rgb, vec3(mx), amt);

    // Apply color tint
    adjustedColor.r = pow(adjustedColor.r, 1.2);
    adjustedColor.g = pow(adjustedColor.g, 0.9);
    adjustedColor.b = pow(adjustedColor.b, 0.8);

    // Clamp and return
    return vec4(clamp(adjustedColor, 0.0, 1.0), color.a);
}
vec4 orange_blue_tonemap(vec4 color) {
    // Define the color balance
    float orange = 1.2;
    float blue = 0.9;

    // Convert color to linear space
    vec3 linearColor = pow(color.rgb, vec3(2.2));

    // Apply color balance
    linearColor.r *= orange;
    linearColor.b *= blue;

    // Apply tone mapping
    vec3 mappedColor = (linearColor + vec3(0.055)) / (linearColor + vec3(1.055));
    mappedColor = pow(mappedColor, vec3(2.4));
    mappedColor *= vec3(1.0 / 1.2);

    // Convert back to sRGB space
    vec3 sRGBColor = pow(mappedColor, vec3(1.0 / 2.2));

    return vec4(sRGBColor, 1.0);
}


vec4 tonemap(vec4 color) {
    float exposure = 1.0;
    float gamma = 2.2;
    float tone_exposure_bias = 1.0;
    float tone_shoulder_strength = 0.25;
    float tone_linear_strength = 0.2;
    float tone_linear_angle = 0.1;
    float tone_white = 11.2;
    float L = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
    float A = color.r - color.g * 0.5 - color.b * 0.5;
    float B = -color.g * 0.866 + color.b * 0.866;
    L *= exposure;
    float t = max(0.0, (L - tone_exposure_bias));
    float tone_mapped = (t * (tone_shoulder_strength * t + tone_linear_strength * tone_linear_angle) + tone_linear_strength * (L + 0.01)) / (t * (tone_shoulder_strength * t + tone_linear_strength) + tone_linear_strength * (L + 0.01));
    float C = pow(tone_mapped, gamma);
    float W = pow(tone_white, gamma);
    vec4 result;
    result.r = (A * C + B * sqrt(C) + L * (1.0 - C)) * W;
    result.g = (A * C + B * sqrt(C) + L * (1.0 - C)) * W;
    result.b = (A * C + B * sqrt(C) + L * (1.0 - C)) * W;
    result.a = color.a;
    return result;
}



void main()
{

    float rimFactor = 0.3;
    float edgeFactor = 0.3;
    float lightFactor = 1.0;
    float diffuseFactor = 1.0;
    float ambientFactor = 0.3;
    float fogFactor = 0.0;
    float specFactor = 0.3;
    float orthoLight = OrthoLight(1);

    vec4 ambientWorldLight = AmbientWorldLight();

    float fTotals = (rimFactor+lightFactor+fogFactor+diffuseFactor+specFactor);
    vec4 color =
   // ((ambientColor) * Rim() * rimFactor) +
    //(specularColor * (1.0 - AmbientOcclusion()))  +//+
    (ambientWorldLight * Rim() * orthoLight * rimFactor) +//vColor * Phong2()
   ((vColor * orthoLight) * Phong2()) + (ambientWorldLight*(1.0-orthoLight) * 0.2)
    ;
    //(1.0-(orthoLight - AmbientOcclusion()));/*(
    //(vColor * diffuseFactor) * (orthoLight - AmbientOcclusion())*.
    //+
    //AmbientWorldLight()
    // );
    /*normalize(mix(
    vColor ,
    (((AmbientWorldLight())) + vec4(ambientColor,1.0)),
    (1.0 - orthoLight)
    ));*/



    /*normalize(
        (vColor + OrthoLight(1) + (AmbientWorldLight() * Rim()))
        * OrthoLight(1)
    ).rgb;*/
    gl_FragColor = (vec4((color.rgb), 1));//vColor + (AmbientWorldLight()*Rim() * 0.25);//vec4(normalize((AmbientWorldLight()).xyz), 1.0);//vec4(vec3((sin(fTime)/2)+0.5), 1);// vec4(vNormal, 1.0);//AmbientWorldLight();//vec4((Rim() + Specular() + Phong()).xyz,1.0);//Rim();////vColor + Phong();

}
