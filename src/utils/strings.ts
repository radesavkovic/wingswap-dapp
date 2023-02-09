export function capitalizeFirstLetter(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ellipsis(value: string, pad: { left: number; right: number }) {
  const { left, right } = pad;
  if (value.length <= left + right) {
    return value;
  }

  const _leftPath = left;
  const _rightPad = value.length - right;
  return value.substr(0, _leftPath) + '...' + value.substr(_rightPad, value.length);
}
