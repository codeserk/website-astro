#include <packing>
#define PI 3.1415926535897932384626433832795
#define PI_2 6.283185307179586

varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform sampler2D tNormal;
uniform float cameraNear;
uniform float cameraFar;
uniform vec2 resolution;
uniform float shadowType;

const mat3 Sx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);
const mat3 Sy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);

  return fract((p3.x + p3.y) * p3.z);
}

float readDepth(sampler2D depthTexture, vec2 coord) {
  float fragCoordZ = texture2D(depthTexture, coord).x;
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

float luma(vec3 color) {
  const vec3 magic = vec3(0.2125, 0.7154, 0.0721) * 2.0;
  return dot(magic, color);
}

void main() {
  vec2 uv = vUv;
  vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);

  float outlineThickness = 1.2;
  vec4 outlineColor = vec4(0.0, 0.0, 0.0, 1.0);

  vec2 displacement = vec2((hash(gl_FragCoord.xy) * sin(gl_FragCoord.y * 0.05)), (hash(gl_FragCoord.xy) * cos(gl_FragCoord.x * 0.05))) * 2.0 / resolution.xy;
  vec2 hatchetDisplacement = vec2((hash(gl_FragCoord.xy) * cos(gl_FragCoord.y * 0.0009)), (hash(gl_FragCoord.xy) * 0.0)) / resolution.xy;

  float depth = readDepth(tDepth, vUv);
  vec4 pixelColor = texture2D(tDiffuse, vUv);

  float depth00 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, 1));
  float depth01 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, 0));
  float depth02 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1, -1));

  float depth10 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, -1));
  float depth11 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, 0));
  float depth12 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(0, 1));

  float depth20 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, -1));
  float depth21 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, 0));
  float depth22 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(1, 1));

  float xSobelValueDepth = Sx[0][0] * depth00 + Sx[1][0] * depth01 + Sx[2][0] * depth02 +
    Sx[0][1] * depth10 + Sx[1][1] * depth11 + Sx[2][1] * depth12 +
    Sx[0][2] * depth20 + Sx[1][2] * depth21 + Sx[2][2] * depth22;

  float ySobelValueDepth = Sy[0][0] * depth00 + Sy[1][0] * depth01 + Sy[2][0] * depth02 +
    Sy[0][1] * depth10 + Sy[1][1] * depth11 + Sy[2][1] * depth12 +
    Sy[0][2] * depth20 + Sy[1][2] * depth21 + Sy[2][2] * depth22;

  float gradientDepth = sqrt(pow(xSobelValueDepth, 2.0) + pow(ySobelValueDepth, 2.0));

  float normal00 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, -1)).rgb);
  float normal01 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, 0)).rgb);
  float normal02 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(-1, 1)).rgb);

  float normal10 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, -1)).rgb);
  float normal11 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, 0)).rgb);
  float normal12 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(0, 1)).rgb);

  float normal20 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, -1)).rgb);
  float normal21 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, 0)).rgb);
  float normal22 = luma(texture2D(tNormal, vUv + displacement + outlineThickness * texel * vec2(1, 1)).rgb);

  float xSobelNormal = Sx[0][0] * normal00 + Sx[1][0] * normal10 + Sx[2][0] * normal20 +
    Sx[0][1] * normal01 + Sx[1][1] * normal11 + Sx[2][1] * normal21 +
    Sx[0][2] * normal02 + Sx[1][2] * normal12 + Sx[2][2] * normal22;

  float ySobelNormal = Sy[0][0] * normal00 + Sy[1][0] * normal10 + Sy[2][0] * normal20 +
    Sy[0][1] * normal01 + Sy[1][1] * normal11 + Sy[2][1] * normal21 +
    Sy[0][2] * normal02 + Sy[1][2] * normal12 + Sy[2][2] * normal22;

  float gradientNormal = sqrt(pow(xSobelNormal, 2.0) + pow(ySobelNormal, 2.0));

  float outline = gradientDepth * 1.0 + gradientNormal;

  float pixelLuma = luma(pixelColor.rgb);

  float modVal = 9.5;

  if(shadowType == 3.0) {
    float steps = 80.0;
    float stepsMod = 11.7;
    float thickness = 0.5;

    // if(pixelLuma <= 0.5 && depth <= 0.99) {
    //   if(sin(2.0 * ((-hatchetDisplacement.y - hatchetDisplacement.x - vUv.y + vUv.x) * steps) * PI) > 0.0) {
    //     pixelColor = outlineColor;
    //   }
    // }

    // if(pixelLuma <= 0.6 && depth <= 0.99) {
    //   if(sin(2.0 * ((hatchetDisplacement.y + hatchetDisplacement.x + vUv.y + vUv.x) * steps) * PI) > 0.8) {
    //     pixelColor = outlineColor;
    //   }
    // }

    // if(pixelLuma <= 0.5 && depth <= 0.99) {
    //   float mult = PI_2 * steps;
    //   float value = cos((vUv.x + vUv.y) * mult * 4.0);
    //   if(value > 1.0 - 0.4) {
    //     pixelColor = outlineColor;
    //   }
    // }

    // if(pixelLuma <= 0.65 && depth <= 0.99) {
    //   float mult = PI_2 * steps;
    //   float value = cos((vUv.x + hatchetDisplacement.x + vUv.y + hatchetDisplacement.y) * mult);
    //   if(value > 1.0 - 0.1) {
    //     pixelColor = outlineColor;
    //   }
    // }

    // if(pixelLuma <= 0.7 && depth <= 0.99) {
    //   float mult = PI_2 * steps;
    //   float value = cos((vUv.x + hatchetDisplacement.x + vUv.y + hatchetDisplacement.y) * mult);
    //   if(value > 1.0 - 0.05) {
    //     pixelColor = outlineColor;
    //   }
    // }

    // if(pixelLuma <= 0.4 && depth <= 0.99) {
    //   float mult = PI_2 * steps;
    //   float value = cos((vUv.x + hatchetDisplacement.x + vUv.y + hatchetDisplacement.y) * mult);
    //   if(value > 1.0 - 0.9) {
    //     pixelColor = outlineColor;
    //   }
    // }
    // if(pixelLuma <= 0.6 && depth <= 0.99) {
    //   float mult = PI_2 * steps;
    //   float value = cos((vUv.x + hatchetDisplacement.x + vUv.y + hatchetDisplacement.y) * mult);
    //   if(value > 1.0 - 0.5) {
    //     pixelColor = outlineColor;
    //   }
    // }
    // if(pixelLuma <= 0.7 && depth <= 0.99) {
    //   float mult = PI_2 * steps;
    //   float value = cos((vUv.x + hatchetDisplacement.x + vUv.y + hatchetDisplacement.y) * mult);
    //   if(value > 1.0 - 0.01) {
    //     pixelColor = outlineColor;
    //   }
    // }
    if(pixelLuma <= 0.8 && depth <= 0.99) {
      float mult = PI_2 * steps;
      float value = cos((vUv.x + hatchetDisplacement.x + vUv.y + hatchetDisplacement.y) * mult);
      if(pixelLuma < 0.4 && value > 1.0 - 0.2) {
        pixelColor = outlineColor;
      }
      if(pixelLuma >= 0.4 && pixelLuma < 0.5 && value > 1.0 - 0.18) {
        pixelColor = outlineColor;
      }
      if(pixelLuma >= 0.5 &&  pixelLuma < 0.65 && value > 1.0 - 0.07) {
        pixelColor = outlineColor;
      }
      if(pixelLuma >= 0.65 &&  pixelLuma < 0.7 && value > 1.0 - 0.04) {
        pixelColor = outlineColor;
      }
      if(pixelLuma > 0.7 && value > 1.0 - 0.001) {
        pixelColor = outlineColor;
      }
      // if(pixelLuma >= 0.7 && value > 1.0 - 0.05) {
      //   pixelColor = outlineColor;
      // }
    }

    // if(pixelLuma <= 0.8 && depth <= 0.99) {
    //   if(sin(2.0 * ((vUv.y + vUv.x) * steps) * PI) > 0.95) {
    //     pixelColor = outlineColor;
    //   }
    // }

    // if(pixelLuma <= 0.2 && depth <= 0.99) {
    //   if(mod((vUv.y + hatchetDisplacement.x) * resolution.x - (vUv.x + hatchetDisplacement.y) * resolution.x, stepsMod) < 1.0) {
    //     pixelColor = outlineColor;  //vec4(1.0, 0.0, 0.0, 1.0);
    //   };
    // }
    // if(pixelLuma <= 0.7 && depth <= 0.99) {
    //   if(mod((vUv.y + hatchetDisplacement.x) * resolution.x - (vUv.x + hatchetDisplacement.y) * resolution.x, stepsMod) < 1.0 && mod((vUv.y + hatchetDisplacement.x) * resolution.x, stepsMod / 8.0) < 1.0) {
    //     pixelColor = outlineColor;  //vec4(1.0, 0.0, 0.0, 1.0);
    //   };
    // }
  }

  vec4 color = mix(pixelColor, outlineColor, outline);
  vec4 saturatedColor = clamp(color, (1.0 - pixelLuma) * 0.2, pixelLuma * 1.5);

  gl_FragColor = vec4(saturatedColor.x, saturatedColor.y, saturatedColor.z, 1.0);
}

#include <tonemapping_fragment>