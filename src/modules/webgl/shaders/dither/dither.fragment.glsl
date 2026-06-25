#include <packing>

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float ditherStrength;
uniform float ditherScale;
uniform float paletteLevels;

// Depth-based cel outline
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform float outlineThickness;
uniform float outlineThreshold;
uniform vec3 outlineColor;
uniform float outlineDistortion;

// Fire flicker (Albatross world shader port)
uniform float time;
uniform vec2 fireScreenPos;
uniform float fireRadius;
uniform vec3 fireColor;
uniform float fireFlickerAmount;
uniform float fireFlickerFps;
uniform float fireFlickerSpeed;

const mat3 Sx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);
const mat3 Sy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);

// 4x4 Bayer ordered-dither matrix, normalised 0..1 with median at 0.5.
float bayer4(vec2 cell) {
  int x = int(mod(cell.x, 4.0));
  int y = int(mod(cell.y, 4.0));
  int idx = y * 4 + x;
  if (idx == 0)  return  0.0 / 16.0;
  if (idx == 1)  return  8.0 / 16.0;
  if (idx == 2)  return  2.0 / 16.0;
  if (idx == 3)  return 10.0 / 16.0;
  if (idx == 4)  return 12.0 / 16.0;
  if (idx == 5)  return  4.0 / 16.0;
  if (idx == 6)  return 14.0 / 16.0;
  if (idx == 7)  return  6.0 / 16.0;
  if (idx == 8)  return  3.0 / 16.0;
  if (idx == 9)  return 11.0 / 16.0;
  if (idx == 10) return  1.0 / 16.0;
  if (idx == 11) return  9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return  7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return            5.0 / 16.0;
}

float interleavedGradientNoise(vec2 pixelCoord) {
  vec3 m = vec3(0.06711056, 0.00583715, 52.9829189);
  return fract(m.z * fract(dot(pixelCoord, m.xy)));
}

float readDepth(sampler2D depthTex, vec2 coord) {
  float fragCoordZ = texture2D(depthTex, coord).x;
  float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
  return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

// Cheap hash used to wobble outline sample UVs per pixel (hand-inked look).
float outlineHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec4 src = texture2D(tDiffuse, vUv);
  vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);

  float ds = max(floor(ditherScale + 0.5), 1.0);
  vec2 pixel = vUv * resolution;
  vec2 cell = floor(pixel / ds);

  // Screen-space fire proximity - falls off from fireScreenPos.
  float dist = distance(vUv, fireScreenPos);
  float fireProx = 1.0 - smoothstep(0.0, fireRadius, dist);
  float fire = fireProx * fireFlickerAmount;

  // Stop-motion flicker clock.
  float fps = max(fireFlickerFps, 0.1);
  float stepIndex = floor(time * fps);
  float firePhase = stepIndex * fireFlickerSpeed;

  vec3 lit = src.rgb;

  // BaseShift: pre-quantize binary spark/dim near the fire.
  if (fire > 0.001) {
    float n = interleavedGradientNoise(cell + vec2(firePhase * 1.7, firePhase * 3.1));
    float sparkProb = clamp(fire * 0.10, 0.0, 1.0);
    float dimProb   = clamp(fire * 0.18, 0.0, 1.0);
    if (n < sparkProb) {
      lit += fire * 0.16 * fireColor;
    } else if (n < sparkProb + dimProb) {
      lit -= fire * 0.06 * (fireColor * 0.4);
    }
  }

  // Bayer ordered-dither shifts colour before palette quantize.
  float threshold = bayer4(cell) - 0.5;
  float levels = max(floor(paletteLevels + 0.5), 2.0);
  float stepSize = 1.0 / levels;
  lit += threshold * stepSize * ditherStrength;
  lit = floor(lit * levels) / max(levels - 1.0, 1.0);

  // DitherOverlay: post-quantize warm sparkle.
  if (fire > 0.001) {
    float n = interleavedGradientNoise(cell + vec2(firePhase * 1.7, firePhase * 3.1));
    float sparkProb = clamp(fire * 0.15, 0.0, 1.0);
    if (n < sparkProb) {
      lit = mix(lit, fireColor, clamp(fire * 0.55, 0.0, 1.0));
    }
  }

  // Depth-based cel outline with hand-inked wobble.
  // Applied AFTER dither + quantize so the line stays a solid color and
  // doesn't get broken up by the Bayer pattern.
  float centerDepth = readDepth(tDepth, vUv);
  if (centerDepth <= 0.99) {
    // Per-pixel UV jitter (pixel-scale amplitude, hashed off native frag coords
    // so the wobble doesn't scale with the post-process resolution).
    float h1 = outlineHash(gl_FragCoord.xy);
    float h2 = outlineHash(gl_FragCoord.xy + vec2(17.3, 41.7));
    vec2 displacement = vec2(
      h1 * sin(gl_FragCoord.y * 0.05),
      h2 * cos(gl_FragCoord.x * 0.05)
    ) * outlineDistortion * texel;

    float d00 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1.0,  1.0));
    float d01 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1.0,  0.0));
    float d02 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2(-1.0, -1.0));
    float d10 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2( 0.0, -1.0));
    float d11 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2( 0.0,  0.0));
    float d12 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2( 0.0,  1.0));
    float d20 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2( 1.0, -1.0));
    float d21 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2( 1.0,  0.0));
    float d22 = readDepth(tDepth, vUv + displacement + outlineThickness * texel * vec2( 1.0,  1.0));

    float sx = Sx[0][0] * d00 + Sx[1][0] * d01 + Sx[2][0] * d02 +
               Sx[0][1] * d10 + Sx[1][1] * d11 + Sx[2][1] * d12 +
               Sx[0][2] * d20 + Sx[1][2] * d21 + Sx[2][2] * d22;
    float sy = Sy[0][0] * d00 + Sy[1][0] * d01 + Sy[2][0] * d02 +
               Sy[0][1] * d10 + Sy[1][1] * d11 + Sy[2][1] * d12 +
               Sy[0][2] * d20 + Sy[1][2] * d21 + Sy[2][2] * d22;

    float edge = sqrt(sx * sx + sy * sy);
    if (edge > outlineThreshold) {
      lit = outlineColor;
    }
  }

  gl_FragColor = vec4(clamp(lit, 0.0, 1.0), src.a);
}
