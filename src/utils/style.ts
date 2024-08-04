type ClassName = Record<string, boolean | undefined> | string

/**
 * Converts record of class -> condition into list of classes
 * @param dynamic
 * @param classes
 */
export function classes(...classNames: ClassName[]): string {
  return classNames
    .flatMap((it) => {
      if (!it) {
        return ''
      }
      if (typeof it === 'string') {
        return it
      }

      return Object.entries(it)
        .filter((entry) => entry[1])
        .map((entry) => entry[0])
        .join(' ')
        .concat(' ')
    })
    .filter(Boolean)
    .join(' ')
}
