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
  let recallCourses = localStorage.getItem('storedData');

  // checks if there is data stored in local storage and if the
  //refresh button is clicked
  if (recallCourses && document.querySelector('#dataRefresh').clicked) {
    // empty local storage
    recallCourses = null;
    console.log(recallCourses);
  }

  let courses = null;
  // check if there is local storage
  if (recallCourses) {
    // if there is local storage and converts data to JSON to save to browser
    courses = JSON.parse(recallCourses);
    // if there is no local storage then set local storage
  } else {
    courses = await getData();
    localStorage.setItem('storedData', JSON.stringify(courses));
  }

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

// query selector for checkboxes
const filter = document.querySelectorAll('input[type="checkbox"]');

// enabling filtering by checkbox
filter.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedSections = Array.from(filter)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    processing_request(selectedSections);
  });
});

// query selector for refresh button
document.querySelector("#dataRefresh").addEventListener("click", () => {
  // if clicked remove local storage
  localStorage.removeItem('storedData');
  // call processing_request
  processing_request();
})

document.addEventListener("DOMContentLoaded", () => {
  processing_request();
});
