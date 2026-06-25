import { Pass } from 'postprocessing'
import { ShaderMaterial, Texture, Vector2, WebGLRenderTarget, WebGLRenderer } from 'three'
import { FullScreenQuad } from 'three-stdlib'
import type { Camera } from '@react-three/fiber'
import { ditherShader } from './dither.shader'

interface DitherPassArgs {
  depthRenderTarget?: WebGLRenderTarget<Texture>
  camera?: Camera
  ditherStrength?: number
  ditherScale?: number
  paletteLevels?: number
  fireFlickerAmount?: number
}

export class DitherPass extends Pass {
  readonly material: ShaderMaterial
  private readonly fsQuad: FullScreenQuad
  private readonly resolution: Vector2
  private readonly depthRenderTarget?: WebGLRenderTarget<Texture>
  private readonly _camera?: Camera

  constructor(args?: DitherPassArgs) {
    super()

    this.material = new ShaderMaterial(ditherShader)
    this.fsQuad = new FullScreenQuad(this.material)

    this.depthRenderTarget = args?.depthRenderTarget
    this._camera = args?.camera

    if (args?.ditherStrength !== undefined) {
      this.material.uniforms.ditherStrength.value = args.ditherStrength
    }
    if (args?.ditherScale !== undefined) {
      this.material.uniforms.ditherScale.value = args.ditherScale
    }
    if (args?.paletteLevels !== undefined) {
      this.material.uniforms.paletteLevels.value = args.paletteLevels
    }
    if (args?.fireFlickerAmount !== undefined) {
      this.material.uniforms.fireFlickerAmount.value = args.fireFlickerAmount
    }

    const dpr = Math.min(window.devicePixelRatio, 2)
    this.resolution = new Vector2(2048 * dpr, 2048 * dpr)
  }

  setTime(t: number) {
    this.material.uniforms.time.value = t
  }

  dispose() {
    this.material.dispose()
    this.fsQuad.dispose()
  }

  render(renderer: WebGLRenderer, readBuffer: WebGLRenderTarget | null, writeBuffer: WebGLRenderTarget | null) {
    if (!readBuffer?.texture) {
      return
    }

    this.material.uniforms.tDiffuse.value = readBuffer.texture
    this.material.uniforms.resolution.value = this.resolution
    if (this.depthRenderTarget) {
      this.material.uniforms.tDepth.value = this.depthRenderTarget.depthTexture
    }
    if (this._camera) {
      this.material.uniforms.cameraNear.value = this._camera.near
      this.material.uniforms.cameraFar.value = this._camera.far
    }

    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      this.fsQuad.render(renderer)
    } else {
      renderer.setRenderTarget(writeBuffer)
      renderer.clear()
      this.fsQuad.render(renderer)
    }
  }
}
