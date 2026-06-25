import { Vector2, Vector3, type ShaderMaterialParameters } from 'three'
import vertexShader from './dither.vertex.glsl'
import fragmentShader from './dither.fragment.glsl'

export const ditherShader: ShaderMaterialParameters = {
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new Vector2() },
    ditherStrength: { value: 0.85 },
    ditherScale: { value: 2.0 },
    paletteLevels: { value: 7.0 },

    // Depth-based cel outline
    tDepth: { value: null },
    cameraNear: { value: 0.1 },
    cameraFar: { value: 100.0 },
    outlineThickness: { value: 5.0 },
    outlineThreshold: { value: 0.0015 },
    outlineColor: { value: new Vector3(0.0, 0.0, 0.0) },
    outlineDistortion: { value: 5.0 },

    // Fire flicker (Albatross port)
    time: { value: 0.0 },
    fireScreenPos: { value: new Vector2(0.5, 0.18) },
    fireRadius: { value: 0.45 },
    fireColor: { value: new Vector3(1.0, 0.55, 0.15) },
    fireFlickerAmount: { value: 1.5 },
    fireFlickerFps: { value: 2.0 },
    fireFlickerSpeed: { value: 0.1 },
  },
  vertexShader,
  fragmentShader,
}
