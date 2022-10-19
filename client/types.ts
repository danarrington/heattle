export type aggregatedYearlyTemps = {
  aggregatedTemps: AggregatedTempCounts;
  year: number;
};
export type AggregatedTempCounts = {
  "80": number;
  "85": number;
  "90": number;
  "95": number;
  "100": number;
};
export type rawYearlyTemps = {
  year: number;
  hotDays: number[];
};
