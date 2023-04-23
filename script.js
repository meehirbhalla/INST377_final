function initChart(chart) {
  const labels = ["January", "February", "March", "April", "May", "June"];

  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };

  return new Chart(
    chart, 
    config
  );
}

async function getData() {
  const url = '';
  const data = await fetch(url);
  const json = await data.json();
  const reply = json.filter((item) => Boolean(item.courses)).filter((item) => Boolean(item.open_seats));
  return reply;
}

async function mainEvent() {
  const chartTarget = document.querySelector("#myChart");

//   const results = await fetch ('https://beta.umd.io/');
// //   convert results to JSON
//   const arrayFromJson = await results.json();

  initChart(chartTarget);
}

// the async keyword means we can make API requests
document.addEventListener("DOMContentLoaded", async () => mainEvent());
