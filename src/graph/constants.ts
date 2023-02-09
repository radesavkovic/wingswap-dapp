export enum TimeframeOptions {
  WEEK,
  MONTH,
  HALF_YEAR,
  ALL_TIME,
}

// tokens that should be tracked but arent due to lag in subgraph
export const TRACKED_OVERRIDES: string[] = [];

export const up = '↑';

export const down = '↓';

export enum PAIR_SORT_FIELD {
  LIQ,
  VOL,
  VOL_7DAYS,
  FEES,
  APY,
}

export enum TOKEN_SORT_FIELD {
  LIQ,
  VOL,
  VOL_UT,
  SYMBOL,
  NAME,
  PRICE,
  CHANGE,
}

export enum TRANSACTION_SORT_FIELD {
  TOTAL_VALUE,
  TOKEN_AMOUNT_0,
  TOKEN_AMOUNT_1,
  TIME,
}
