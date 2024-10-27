import { Pass } from 'postprocessing'
import { ShaderMaterial, Texture, Vector2, WebGLRenderTarget, WebGLRenderer } from 'three'
import { moebiusShader } from './moebius.shader'
import { FullScreenQuad } from 'three-stdlib'
import type { Camera } from '@react-three/fiber'

export class MoebiusPass extends Pass {
  private readonly material: ShaderMaterial
  private readonly fsQuad: FullScreenQuad
  private readonly depthRenderTarget: WebGLRenderTarget<Texture>
  private readonly normalRenderTarget: WebGLRenderTarget<Texture>
  private readonly _camera: Camera
  private readonly resolution: Vector2
  private readonly amplitude: number
  private readonly frequency: number

  constructor(args?: any) {
    super()

    this.material = new ShaderMaterial(moebiusShader)
    this.fsQuad = new FullScreenQuad(this.material)

    this.depthRenderTarget = args?.depthRenderTarget
    this.normalRenderTarget = args?.normalRenderTarget
    this._camera = args?.camera
    this.frequency = args?.frequency
    this.amplitude = args?.amplitude
    this.resolution = new Vector2(
      2000 * Math.min(window.devicePixelRatio, 2),
      2000 * Math.min(window.devicePixelRatio, 2),
    )
  }

  dispose() {
    this.material.dispose()
    this.fsQuad.dispose()
  }

  render(renderer: WebGLRenderer, readBuffer: WebGLRenderTarget | null, writeBuffer: WebGLRenderTarget | null) {
    if (!readBuffer?.texture) {
      return
    }

    this.material.uniforms.tDiffuse.value = readBuffer?.texture
    this.material.uniforms.tDepth.value = this.depthRenderTarget.depthTexture
    this.material.uniforms.tNormal.value = this.normalRenderTarget.texture
    this.material.uniforms.cameraNear.value = this._camera.near
    this.material.uniforms.cameraFar.value = this._camera.far
    this.material.uniforms.frequency.value = this.frequency
    this.material.uniforms.amplitude.value = this.amplitude
    this.material.uniforms.resolution.value = this.resolution

    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      this.fsQuad.render(renderer)
    } else {
      renderer.setRenderTarget(writeBuffer)
      // if (this.clear) {
      renderer.clear()
      // }

      // this.fsQuad.render(renderer)
    }
  }
}
