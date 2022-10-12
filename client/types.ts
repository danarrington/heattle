export type aggregatedYearlyTemps = {
  aggregatedTemps: {
    "80": number;
    "85": number;
    "90": number;
    "95": number;
    "100": number;
  };
  year: number;
};
export type rawYearlyTemps = {
  year: number;
  hotDays: number[];
};
