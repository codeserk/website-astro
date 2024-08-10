import { execSync } from 'child_process'

export function remarkModifiedTime() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_: unknown, file: any) {
    const filepath = file.history[0]
    // const createdAt = execSync(`git log --follow --pretty="format:%cI" --date default "${filepath}"  | tail -1`)
    const lastModified = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`)

    // file.data.astro.frontmatter.createdAt = createdAt.toString()
    file.data.astro.frontmatter.lastModified = lastModified.toString()
  }
}
