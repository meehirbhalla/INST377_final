// An asynchronous data request to your API
async function getData() {
  const url = "https://api.umd.io/v0/courses/list";
  const data = await fetch(url);
  const json_data = await data.json();
}

// A processing request that uses array methods (.map, .filter, .find, .reduce) to change
// your data into the shape your chart, map, or other component needs for display.
async function processing_request() {
  const courses = await getData();

  const openSections = [];

  for (const course of courses) {
    const sections = "https://api.umd.io/v0/courses/${course.course_id}/sections";
    const sectionData = await fetch(sections);
    const sectionJson = await sectionData.json();

    const filterSections = sectionJson.filter(item => item.open_seats > 0);
  }
}
