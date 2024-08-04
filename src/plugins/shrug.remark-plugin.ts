import type { Nodes, Root } from 'mdast'
import { findAndReplace } from 'mdast-util-find-and-replace'
import type { Plugin } from 'unified'

export const remarkShrugPlugin: Plugin<null[], Root> = () => {
  function transformer(tree: Nodes): void {
    findAndReplace(tree, [
      '/shrug',
      (): string => {
        return '¯\\_(ツ)_/¯'
      },
    ])
  }

  return transformer
}
