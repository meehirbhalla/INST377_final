async function getSectionIDs() {
  const url = "https://api.umd.io/v0/courses/INST377/sections";
  const data = await fetch(url);
  const json_data = await data.json();
  const sectionIDs = json_data.map((section) => section.section_id);
  return sectionIDs;
}

getSectionIDs().then((ids) => console.log(ids));
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
  const openSections = courses.filter((item) => item.open_seats > 0);

  // only display selected sections when using filter checkboxes
  const filteredSections = selectedSections.length
    ? openSections.filter((item) => selectedSections.includes(item.section_id))
    : openSections;

  const sections = filteredSections.map((item) => item.section_id);

  const openSeats = filteredSections.map((item) => item.open_seats);

  const chartTarget = document.querySelector("#myChart");

  // checks if window.myChart is defined and if destroy is a function
  if (window.myChart && typeof window.myChart.destroy === "function") {
    window.myChart.destroy();
  }

  // Data visualization using chart.js
  window.myChart = new Chart(chartTarget, {
    type: "bar",
    data: {
      labels: sections,
      datasets: [
        {
          label: "Open Seats",
          backgroundColor: "rgb(120, 120, 120)",
          borderColor: "rgb(0, 0, 0)",
          data: openSeats,
        },
      ],
    },
    options: {},
  });
}

const filter = document.querySelectorAll('input[type="checkbox"]');

filter.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedSections = Array.from(filter)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    processing_request(selectedSections);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  processing_request();
});
