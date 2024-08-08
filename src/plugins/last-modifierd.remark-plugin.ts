import { execSync } from 'child_process'

export function remarkModifiedTime() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_: unknown, file: any) {
    const filepath = file.history[0]
    const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`)

    file.data.astro.frontmatter.lastModified = result.toString()
  }
}
