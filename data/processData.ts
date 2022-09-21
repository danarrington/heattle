import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { resourceLimits } from "worker_threads";

type RawDailyTemperature = {
  Station: string;
  Name: string;
  Date: string;
  TAVG: string;
  TMAX: string;
  TMIN: string;
};

type ProcessedResult = {
  Year: number;
  HotDays: number[];
};

// Results: {results: [{year:1990, temps:[80, 80]}]}
const YEAR_TO_START = 1990;

(() => {
  const csvFilePath = path.resolve(__dirname, "3080677.csv");

  const headers = ["Station", "Name", "Date", "TAVG", "TMAX", "TMIN"];

  const fileContent = fs.readFileSync(csvFilePath, { encoding: "utf-8" });

  parse(
    fileContent,
    {
      delimiter: ",",
      columns: headers,
    },
    (error, result: RawDailyTemperature[]) => {
      if (error) {
        console.error(error);
      }

      // console.log("Result", result);
      something(result);
    }
  );
})();

const something = (result: RawDailyTemperature[]) => {
  const dataStructure: ProcessedResult[] = [];

  const findOrAddYear = (year: number) => {
    for (const pr of dataStructure) {
      if (pr.Year == year) return pr;
    }
    const pr: ProcessedResult = {
      Year: year,
      HotDays: [],
    };
    dataStructure.push(pr);
    return pr;
  };

  console.log(result.length);

  for (const day of result) {
    const date = new Date(day.Date);
    if (date.getFullYear() < YEAR_TO_START) continue;

    const pr = findOrAddYear(date.getFullYear());
    const temp = Number(day.TMAX);
    if (temp > 80) {
      pr.HotDays.push(temp);
    }
  }

  printResults(dataStructure);
};

const printResults = (dataStructure: ProcessedResult[]) => {
  for (const result of dataStructure) {
    console.log(result.Year);
    const nums = {
      80: 0,
      85: 0,
      90: 0,
      95: 0,
      100: 0,
    };
    for (const temp of result.HotDays) {
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
    console.log(nums);
  }
};
