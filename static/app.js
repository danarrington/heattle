console.log("runnin some js!");

const CHART_CONFIG = {
  ranges: [80, 85, 90, 95, 100],
  barWidth: 12,
  height: 150,
  width: 300,
};

const fetchData = async () => {
  const myRequest = new Request("seattle-data-1990.json");
  const response = await fetch(myRequest);
  return response.json();
};

const main = async () => {
  const data = await fetchData();
  console.log(data.length);

  for (const year of data) {
    drawYear(year);
    await new Promise((r) => setTimeout(r, 500));
  }
  // drawYear(data[0]);
};

const drawYear = (year) => {
  console.log(`drawYear ${year.year}`);
  var c = document.getElementById("chart");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  var c = (document.getElementById("yearTitle").textContent = year.year);

  const aggregatedData = aggregateYearData(year);
  for (const [key, value] of Object.entries(aggregatedData)) {
    drawTempValue(key, value);
  }
};

const aggregateYearData = (year) => {
  const nums = {
    80: 0,
    85: 0,
    90: 0,
    95: 0,
    100: 0,
  };

  for (const temp of year.hotDays) {
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

// 80 : 0, 60
// 85 : 60, 60
// 20 : 0
// 10 : 75
// 0 : 150 150 - count*7.5

const drawTempValue = (temp, count) => {
  console.log(`Drawing ${temp} : ${count}`);
  if (count == 0) return;

  const x = Math.abs(CHART_CONFIG.ranges[0] - temp) * CHART_CONFIG.barWidth;
  const y = CHART_CONFIG.height - count * 5;
  const height = CHART_CONFIG.height - y;
  var c = document.getElementById("chart");
  var ctx = c.getContext("2d");

  ctx.beginPath();
  ctx.rect(x, y, 60, height);
  ctx.stroke();
};

main();
