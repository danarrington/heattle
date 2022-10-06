const CHART_CONFIG = {
  ranges: [80, 85, 90, 95, 100],
  barWidth: 11,
  height: 150,
  width: 300,
  axisPadding: 24,
};

const fetchData = async () => {
  const myRequest = new Request("seattle-data-1990.json");
  const response = await fetch(myRequest);
  return response.json();
};

const main = async () => {
  const rawData = await fetchData();
  const aggregatedData = aggregateData(rawData);

  for (const year of aggregatedData) {
    addYear(year);
    await new Promise((r) => setTimeout(r, 500));
  }
  // addYear(data[1]);
};

const addYear = (yearData) => {
  addYearToChart(yearData.year, yearData.aggregatedTemps);
  addYearToTimeline(yearData.year, yearData.aggregatedTemps);
};

const addYearToChart = (year, aggregatedTemps) => {
  var c = document.getElementById("chart");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  var c = (document.getElementById("yearTitle").textContent = year);
  drawAxis(ctx);

  for (const [key, value] of Object.entries(aggregatedTemps)) {
    drawTempValue(key, value);
  }
};

const drawAxis = (chart) => {
  const { axisPadding, height, ranges, barWidth } = CHART_CONFIG;

  chart.beginPath();
  chart.moveTo(axisPadding, height - axisPadding);
  chart.lineTo(300, height - axisPadding);
  chart.moveTo(axisPadding, 0);
  chart.lineTo(axisPadding, height - axisPadding);
  chart.stroke();

  chart.font = "12px sans-serif";
  for (let i = 0; i < ranges.length; i++) {
    chart.fillText(ranges[i], axisPadding + 20 + i * 5 * barWidth, height - 5);
  }
  const yLabels = [0, 5, 10, 15, 20];
  for (let i = 0; i < yLabels.length; i++) {
    const offsetToCenterText = 5;
    const y = height - axisPadding - 5 * yLabels[i];
    chart.fillText(yLabels[i], 0, y + offsetToCenterText);
    chart.moveTo(axisPadding - 5, y);
    chart.lineTo(axisPadding, y);
    chart.stroke();
  }
};

const aggregateData = (rawData) => {
  const res = [];
  for (const yearData of rawData) {
    const aggregatedTemps = aggregateYearData(yearData.hotDays);
    res.push({ aggregatedTemps, year: yearData.year });
  }
  return res;
};

const aggregateYearData = (temps) => {
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

const drawTempValue = (temp, count) => {
  if (count == 0) return;

  const { axisPadding, height: chartHeight, barWidth, ranges } = CHART_CONFIG;

  const x = Math.abs(ranges[0] - temp) * barWidth + axisPadding;
  const y = chartHeight - count * 5 - axisPadding;
  const shapeHeight = chartHeight - y - axisPadding;
  var c = document.getElementById("chart");
  var ctx = c.getContext("2d");

  ctx.beginPath();
  ctx.rect(x, y, barWidth * 5, shapeHeight);
  ctx.stroke();
};

/************ TIMELINE *************/
addYearToTimeline = (year, aggregatedTemps) => {
  var c = document.getElementById("timeline");
  var ctx = c.getContext("2d");

  ctx.font = "12px sans-serif";
  ctx.fillStyle = "black";

  let y = Math.abs(1990 - year) * 15;
  ctx.fillText(year, 0, 10 + y);

  const colors = {
    80: "#fff33b",
    85: "#fdc70c",
    90: "#f3903f",
    95: "#ed683c",
    100: "#e93e3a",
  };

  let x = 35;
  for (const [key, value] of Object.entries(aggregatedTemps)) {
    const width = 5 * value;
    ctx.fillStyle = colors[key];
    ctx.fillRect(x, y, width, 10);
    x = x + width;
  }
};

main();
