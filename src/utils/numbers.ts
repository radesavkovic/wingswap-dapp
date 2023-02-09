import numbro from 'numbro';

// using a currency library here in case we want to add more in future
export function formatDollarAmount(num: number | undefined, digits = 2, round = true) {
  if (num === 0) return '$0.00';
  if (!num) return '-';
  if (num < 0.001 && digits <= 3) {
    return '<$0.001';
  }

  return numbro(num).formatCurrency({
    average: round,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B',
    },
  });
}

// using a currency library here in case we want to add more in future
export function formatAmount(num: number | undefined, digits = 2) {
  if (num === 0) return '0';
  if (!num) return '-';
  if (num < 0.001) {
    return '<0.001';
  }
  return numbro(num).format({
    average: true,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B',
    },
  });
}

export function formattedNum(number?: any, usd = false): string {
  if (isNaN(number) || number === '' || number === undefined) {
    return usd ? '$0' : '0';
  }

  const num = parseFloat(number);

  if (num === 0) {
    return usd ? '$0' : '0';
  }

  if (num < 0.0001 && num > 0) {
    return usd ? '< $0.0001' : '< 0.0001';
  }

  return usd
    ? `$${numbro(num).format({
        average: true,
        thousandSeparated: true,
        mantissa: num < 0.1 ? 4 : 2,
        abbreviations: {
          thousand: 'K',
          million: 'M',
          billion: 'B',
        },
      })}`
    : num.toFixed(4).toString();
}

export function formattedPercent(num: any) {
  const percent = parseFloat(num);
  if (!percent || percent === 0) {
    return '0%';
  }

  if (percent < 0.0001 && percent > 0) {
    return '< 0.0001%';
  }

  if (percent < 0 && percent > -0.0001) {
    return '< 0.0001%';
  }

  const fixedPercent = percent.toFixed(2);
  if (fixedPercent === '0.00') {
    return '0%';
  }

  if (percent > 0) {
    if (percent > 100) {
      return `+${percent?.toFixed(0).toLocaleString()}%`;
    } else {
      return `+${fixedPercent}%`;
    }
  } else {
    return `${fixedPercent}%`;
  }
}
