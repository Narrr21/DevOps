const counterElement = document.querySelector("#counter");
const sourceElement = document.querySelector("#source");

function showCounter(event) {
  counterElement.textContent = event.counter;
  if (event.source) {
    sourceElement.textContent = `Last update from ${event.source}`;
  }
}

document.querySelector("#increment").addEventListener("click", async () => {
  await fetch("/api/counter/increment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "client" })
  });
});

const events = new EventSource("/api/events");
events.onmessage = (message) => showCounter(JSON.parse(message.data));
