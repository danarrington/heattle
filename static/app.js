console.log("runnin some js!");

const fetchData = async () => {
  const myRequest = new Request("seattle-data-1990.json");
  const response = await fetch(myRequest);
  return response.json();
};

const main = async () => {
  const data = await fetchData();
  console.log(data.length);
};

main();
