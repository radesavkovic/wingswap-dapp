export interface MetricInfo {
  id: MetricId;
  title: string;
  description: string;
}

export type MetricId =
  | 'active_addresses_24h'
  | 'circulation_1d'
  | 'dev_activity_1d'
  | 'network_growth'
  | 'daily_avg_marketcap_usd'
  | 'mean_dollar_invested_age'
  | 'social_volume_total'
  | 'mvrv_usd_1d';

const metrics: MetricInfo[] = [
  {
    id: 'active_addresses_24h',
    title: 'Active addresses 24h',
    description:
      'The number of distinct addresses that participated in a transfer for the given asset in any given day. Each address is counted only once for the day. Both the senders and the receivers of the asset are counted.',
  },
  {
    id: 'circulation_1d',
    title: 'Circulation 1d',
    description:
      'Circulation shows number of unique coins/tokens being used during a day. If one token/coin changes hands 5 times on a given day, it will be counted once by the token circulation, but 5 times by the transaction volume.',
  },
  {
    id: 'dev_activity_1d',
    title: 'Development activity 1d',
    description:
      "The 'pure' development activity. This allows to better compare projects that use github for issue tracking and projects that do not use github for issue tracking. If such events are not excluded then the second project could have inflated activity just by discussion what they are going to build without actually building it.",
  },
  {
    id: 'network_growth',
    title: 'Network growth',
    description:
      'The amount of new addresses that transfered a given coin/token for the first time. Essentially, this chart illustrates user adoption over time, and can be used to identify when the project is gaining - or losing - traction.',
  },
  {
    id: 'daily_avg_marketcap_usd',
    title: 'Daily average marketcap',
    description: 'The average marketcap in USD during a day.',
  },
  {
    id: 'mean_dollar_invested_age',
    title: 'Mean dollar invested age',
    description: 'Mean dollar invested age',
  },
  {
    id: 'social_volume_total',
    title: 'Social volume',
    description:
      'The total number of text documents that contain the given search term at least once. Examples of documents are telegram messages and reddit posts. If a single short telegram message includes the word crypto more than once, this message will increase the social volume of the word crypto by 1. If a long reddit post contains the word crypto 10 times, this again will increase the social volume of the word crypto by 1.',
  },
  {
    id: 'mvrv_usd_1d',
    title: 'Market value To realized value 1d',
    description:
      "MVRV shows the average profit/loss of all the coins currently in circulation according to the current price. To understand the MVRV metrics, we have to establish two term. 'MV' as in 'Market Value' simply describes the market cap, which is well known when looking at crypto assets. The second part is the 'RV' which stands for 'Realized Value'.",
  },
];

export const distributionMetrics: MetricId[] = ['active_addresses_24h', 'circulation_1d'];
export const fundamentalMetrics: MetricId[] = ['dev_activity_1d', 'network_growth'];
export const financialMetrics: MetricId[] = ['daily_avg_marketcap_usd', 'mean_dollar_invested_age'];
export const signalMetrics: MetricId[] = ['mvrv_usd_1d', 'social_volume_total'];

export default function getMetric(id: MetricId) {
  return metrics.find((m) => m.id === id)!;
}
