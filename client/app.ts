import { addYearToChart } from "./chart";
import { addYearToTimeline } from "./timeline";
import { aggregatedYearlyTemps, rawYearlyTemps } from "./types";

export const CHART_CONFIG = {
  ranges: [80, 85, 90, 95, 100],
  barWidth: 11,
  height: 150,
  width: 300,
  axisPadding: 24,
  colors: {
    "80": "#fff33b",
    "85": "#fdc70c",
    "90": "#f3903f",
    "95": "#ed683c",
    "100": "#e93e3a",
  },
};

const fetchData = async () => {
  const myRequest = new Request("seattle-data-1990.json");
  const response = await fetch(myRequest);
  return response.json() as Promise<rawYearlyTemps[]>;
};

const main = async () => {
  const rawData = await fetchData();
  const aggregatedData = aggregateData(rawData);

  for (const year of aggregatedData) {
    await addYear(year);
  }
  // await addYear(aggregatedData[0]);
  // await addYear(aggregatedData[1]);
};

const addYear = async (yearData: aggregatedYearlyTemps) => {
  await Promise.all([addYearToChart(yearData), addYearToTimeline(yearData)]);
};

const aggregateData = (rawData: rawYearlyTemps[]): aggregatedYearlyTemps[] => {
  const res = [];
  for (const yearData of rawData) {
    const aggregatedTemps = aggregateYearData(yearData.hotDays);
    res.push({ aggregatedTemps, year: yearData.year });
  }
  return res;
};

const aggregateYearData = (temps: number[]) => {
  const nums = {
    80: 0,
    85: 0,
    90: 0,
    95: 0,
    100: 0,
  };

  for (const temp of temps) {
    if (temp > 100) {
      nums[100]++;
    } else if (temp > 95) {
      nums[95]++;
    } else if (temp > 90) {
      nums[90]++;
    } else if (temp > 85) {
      nums[85]++;
    } else if (temp > 80) {
      nums[80]++;
    }
  }

  return nums;
};

main();
