import { Vector2, type ShaderMaterialParameters } from 'three'
import vertexShader from './moebius.vertex.glsl'
import fragmentShader from './moebius.fragment.glsl'

export const moebiusShader: ShaderMaterialParameters = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    tNormal: { value: null },
    cameraNear: { value: null },
    cameraFar: { value: null },
    resolution: {
      value: new Vector2(),
    },
    frequency: { value: 50.05 },
    amplitude: { value: 50.0 },
    shadowType: { value: 3.0 },
    tick: { value: 0.0 },
  },
  vertexShader,
  fragmentShader,
}
