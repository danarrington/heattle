import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";

type RawDailyTemperature = {
  Station: string;
  Name: string;
  Date: string;
  TAVG: string;
  TMAX: string;
  TMIN: string;
};

type YearlyTemperatures = {
  year: number;
  hotDays: number[];
};

const YEAR_TO_START = 1990;
const HOT_DAY_THRESHOLD = 80;

const main = () => {
  const fileContent = readFile("3080677.csv");
  const rawResults = parseFile(fileContent);
  const yearlyTemps = processResults(rawResults);
  printResults(yearlyTemps);
};

const readFile = (filename: string): string => {
  const csvFilePath = path.resolve(__dirname, filename);
  return fs.readFileSync(csvFilePath, { encoding: "utf-8" });
};

const parseFile = (fileContent: string) => {
  const headers = ["Station", "Name", "Date", "TAVG", "TMAX", "TMIN"];
  const options = {
    delimiter: ",",
    columns: headers,
    from_line: 2,
  };

  return parse(fileContent, options) as RawDailyTemperature[];
};

const processResults = (dailyTemps: RawDailyTemperature[]) => {
  const yearlyTemps: YearlyTemperatures[] = [];

  const findOrAddYear = (year: number) => {
    const existingEntry = yearlyTemps.find((yt) => yt.year == year);
    if (existingEntry) return existingEntry;

    const newYear: YearlyTemperatures = {
      year: year,
      hotDays: [],
    };
    yearlyTemps.push(newYear);
    return newYear;
  };

  for (const day of dailyTemps) {
    const date = new Date(day.Date);
    if (date.getFullYear() < YEAR_TO_START) continue;

    const yearlyTemps = findOrAddYear(date.getFullYear());
    const temp = Number(day.TMAX);
    if (temp > HOT_DAY_THRESHOLD) {
      yearlyTemps.hotDays.push(temp);
    }
  }

  return yearlyTemps;
};

const printResults = (dataStructure: YearlyTemperatures[]) => {
  for (const result of dataStructure) {
    console.log(result.year);
    const nums = {
      80: 0,
      85: 0,
      90: 0,
      95: 0,
      100: 0,
    };
    for (const temp of result.hotDays) {
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

main();
