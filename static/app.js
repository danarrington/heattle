console.log("runnin some js!");

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
  const data = await fetchData();
  console.log(data.length);

  for (const year of data) {
    drawYear(year);
    await new Promise((r) => setTimeout(r, 500));
  }
  // drawYear(data[1]);
};

const drawYear = (year) => {
  console.log(`drawYear ${year.year}`);
  var c = document.getElementById("chart");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);

  var c = (document.getElementById("yearTitle").textContent = year.year);
  drawAxis(ctx);

  const aggregatedData = aggregateYearData(year);
  for (const [key, value] of Object.entries(aggregatedData)) {
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

main();
