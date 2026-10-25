const apiUrl = process.env.API_URL || "http://localhost:3000";
const intervalMs = Number(process.env.INTERVAL_MS) || 5000;

async function sendIncrement() {
  try {
    const response = await fetch(`${apiUrl}/api/counter/increment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "clock" })
    });
    if (!response.ok) {
      console.error(`Clock command failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`Clock could not reach API: ${error.message}`);
  }
}

console.log(`Clock started; increasing every ${intervalMs}ms`);
const timer = setInterval(sendIncrement, intervalMs);
sendIncrement();

process.on("SIGTERM", () => {
  clearInterval(timer);
  process.exit(0);
});
