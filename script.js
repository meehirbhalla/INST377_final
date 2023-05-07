// set query value to false
// processing request will not run until this value is true
let query = false;

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
  // initialize recallCourses as storedData from local storage
  let recallCourses = localStorage.getItem("storedData");
  // set refresh default to false
  let refresh = false;

  // check for refresh button click
  if (localStorage.getItem("refresh")) {
    // update refresh value
    refresh = true;
    localStorage.removeItem("refresh");
  }

  // checks if there is data stored in local storage and if the
  //refresh button is clicked
  if (recallCourses && refresh) {
    // remove local storage storedData item
    localStorage.removeItem("storedData");

    // set storedData to null (recallcourses)
    recallCourses = null;
    // clear local storage
    localStorage.clear();

    console.log(recallCourses);
  }

  // intialize courses as null and update later
  let courses = null;

  // check if there is local storage (value in recallCourses)
  if (recallCourses) {
    // if there is local storage - convert recallCourses to JSON to save to browser
    courses = JSON.parse(recallCourses);

    // if there is no local storage then set local storage
  } else {
    courses = await getData();
    localStorage.setItem("storedData", JSON.stringify(courses));
  }

  // open sections filter courses to sections with more than 0 open seats
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

  // only display data visualization if query value is true
  // query button has to be clicked
  if (query) {
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

    // if query button is not clicked, no data should be displayed
  } else {
    const chartTarget = document.querySelector("#myChart");
    // checks if window.myChart is defined and if destroy is a function
    if (window.myChart && typeof window.myChart.destroy === "function") {
      window.myChart.destroy();
    }
    // clear local storage
    localStorage.clear();
  }
}

// query selector for checkboxes
const filter = document.querySelectorAll('input[type="checkbox"]');

// enabling filtering by checkbox
filter.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const selectedSections = Array.from(filter)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    // call processing request and pass selectedSections as an argument
    processing_request(selectedSections);
  });
});

function queryData() {
  // set query to true
  query = true;
  // call processing_request and pass empty array for when no section is selected
  // only call processing request if query button is clicked
  processing_request([]);
}
// query selector for refresh button
document.querySelector("#dataRefresh").addEventListener("click", () => {
  query = false;
  // default refresh item to true
  localStorage.setItem("refresh", true);
  // if clicked remove local storage storedData item
  localStorage.removeItem("storedData");
  // clear local storage
  localStorage.clear();
  // call processing_request and pass empty array for when no section is selected
  processing_request([]);
});

// query selector for query button
// if clicked, query value is set to true and data and visualization are loaded
document.querySelector("#getData").addEventListener("click", queryData);

document.addEventListener("DOMContentLoaded", () => {});
