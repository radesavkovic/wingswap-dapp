export function wrapAsset(path: string) {
  return `url('${path}')`;
}

export const requireAsset = require.context('../assets/', true, /\.(jp?g|png|gif|svg)$/i);

export function combineClassNames(...classNames: Array<string | undefined>) {
  return classNames
    .filter((className) => typeof className === 'string')
    .join(' ')
    .trim();
}
