function initChart(chart, dataObject) {
  const labels = Object.keys(dataObject);
  const info = Object.keys(dataObject).map((item) => dataObject[item].length);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "UMD",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: info,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };

  return new Chart(chart, config);
}

async function getData() {
  const url = "https://api.umd.io/v1/courses/sections";
  const data = await fetch(url);
  const json = await data.json();
  const reply = json
    .filter((item) => Boolean(item.open_seats));
  return reply;
}

async function mainEvent() {
  const chartTarget = document.querySelector("#myChart");

  let storedList = [];

  const results = await fetch(
    "https://api.umd.io/v1/courses/sections"
  );

  // storedList = await results.json();
  // console.table(storedList);
  
  // const chartData = await getData();

  // const shapedData = shapeDataForLineChart(chartData);
  // const myChart = initChart(chartTarget, shapedData);

  initChart(chartTarget);
}

// the async keyword means we can make API requests
document.addEventListener("DOMContentLoaded", async () => mainEvent());
