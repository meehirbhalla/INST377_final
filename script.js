// An asynchronous data request to your API
async function getData() {
  const url = "https://api.umd.io/v0/courses/INST377/sections";
  const data = await fetch(url);
  const json_data = await data.json();
  return json_data;
}

// A processing request that uses array methods (.map, .filter, .find, .reduce) to change
// your data into the shape your chart, map, or other component needs for display.
async function processing_request(selectedSections) {
  const courses = await getData();

  // only display selected sections when using filter checkboxes
  const filteredSections = openSections.filter((item) => selectedSections.includes(item.section_id));

  const openSections = courses.filter((item) => item.open_seats > 0);
  const sections = openSections.map((item) => item.section_id);
  const openSeats = openSections.map((item) => item.open_seats);

  const chartTarget = document.querySelector("#myChart");

  // Data visualization using chart.js
  const myChart = new Chart(chartTarget, {
    type: "bar",
    data: {
      labels: sections,
      datasets: [
        {
          label: "INST377 Open Seats",
          backgroundColor: "rgb(120, 120, 120)",
          borderColor: "rgb(0, 0, 0)",
          data: openSeats,
        },
      ],
    },
    options: {},
  });
}

document.addEventListener("DOMContentLoaded", () => {
  processing_request();
});
