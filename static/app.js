"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // client/canvas.ts
  var getCanvas;
  var init_canvas = __esm({
    "client/canvas.ts"() {
      "use strict";
      getCanvas = (elementId) => {
        const canvas = document.getElementById(elementId);
        const ctx = canvas.getContext("2d");
        return {
          canvas,
          ctx
        };
      };
    }
  });

  // client/timeline.ts
  var addYearToTimeline;
  var init_timeline = __esm({
    "client/timeline.ts"() {
      "use strict";
      init_canvas();
      addYearToTimeline = ({
        year,
        aggregatedTemps
      }) => {
        const { ctx } = getCanvas("timeline");
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "black";
        let y = Math.abs(1990 - year) * 15;
        ctx.fillText(String(year), 0, 10 + y);
        const colors = {
          "80": "#fff33b",
          "85": "#fdc70c",
          "90": "#f3903f",
          "95": "#ed683c",
          "100": "#e93e3a"
        };
        let x = 35;
        for (const [key, value] of Object.entries(aggregatedTemps)) {
          const width = 5 * value;
          ctx.fillStyle = colors[key];
          ctx.fillRect(x, y, width, 10);
          x = x + width;
        }
      };
    }
  });

  // client/app.ts
  var require_app = __commonJS({
    "client/app.ts"(exports) {
      init_canvas();
      init_timeline();
      var CHART_CONFIG = {
        ranges: [80, 85, 90, 95, 100],
        barWidth: 11,
        height: 150,
        width: 300,
        axisPadding: 24
      };
      var fetchData = () => __async(exports, null, function* () {
        const myRequest = new Request("seattle-data-1990.json");
        const response = yield fetch(myRequest);
        return response.json();
      });
      var main = () => __async(exports, null, function* () {
        const rawData = yield fetchData();
        const aggregatedData = aggregateData(rawData);
        addYear(aggregatedData[1]);
      });
      var addYear = (yearData) => {
        addYearToChart(yearData);
        addYearToTimeline(yearData);
      };
      var addYearToChart = ({ year, aggregatedTemps }) => {
        const { canvas, ctx } = getCanvas("chart");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateTitle(String(year));
        drawAxis(ctx);
        for (const [key, value] of Object.entries(aggregatedTemps)) {
          drawTempValue(Number(key), value);
        }
      };
      var updateTitle = (title) => {
        const titleElement = document.getElementById("yearTitle");
        if (!titleElement) {
          return;
        }
        titleElement.textContent = title;
      };
      var drawAxis = (chart) => {
        const { axisPadding, height, ranges, barWidth } = CHART_CONFIG;
        chart.beginPath();
        chart.moveTo(axisPadding, height - axisPadding);
        chart.lineTo(300, height - axisPadding);
        chart.moveTo(axisPadding, 0);
        chart.lineTo(axisPadding, height - axisPadding);
        chart.stroke();
        chart.font = "12px sans-serif";
        for (let i = 0; i < ranges.length; i++) {
          chart.fillText(
            String(ranges[i]),
            axisPadding + 20 + i * 5 * barWidth,
            height - 5
          );
        }
        const yLabels = [0, 5, 10, 15, 20];
        for (let i = 0; i < yLabels.length; i++) {
          const offsetToCenterText = 5;
          const y = height - axisPadding - 5 * yLabels[i];
          chart.fillText(String(yLabels[i]), 0, y + offsetToCenterText);
          chart.moveTo(axisPadding - 5, y);
          chart.lineTo(axisPadding, y);
          chart.stroke();
        }
      };
      var aggregateData = (rawData) => {
        const res = [];
        for (const yearData of rawData) {
          const aggregatedTemps = aggregateYearData(yearData.hotDays);
          res.push({ aggregatedTemps, year: yearData.year });
        }
        return res;
      };
      var aggregateYearData = (temps) => {
        const nums = {
          80: 0,
          85: 0,
          90: 0,
          95: 0,
          100: 0
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
      var drawTempValue = (temp, count) => {
        if (count == 0)
          return;
        const { axisPadding, height: chartHeight, barWidth, ranges } = CHART_CONFIG;
        const { ctx } = getCanvas("chart");
        const x = Math.abs(ranges[0] - temp) * barWidth + axisPadding;
        const y = chartHeight - count * 5 - axisPadding;
        const shapeHeight = chartHeight - y - axisPadding;
        ctx.beginPath();
        ctx.rect(x, y, barWidth * 5, shapeHeight);
        ctx.stroke();
      };
      main();
    }
  });
  require_app();
})();
