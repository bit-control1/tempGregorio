const http = require("http");
const fs = require("fs");

// Function to generate random temperature (15°C - 35°C)
function generateRandomTemperature() {
  return Math.floor(Math.random() * (35 - 15 + 1) + 15);
}

// Function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    // Serve the HTML page
    fs.readFile("index.html", "utf8", (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end("Error loading the HTML file");
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      }
    });
  } else if (req.url === "/temperature") {
    // Generate random temperature in Celsius
    const temperatureCelsius = generateRandomTemperature();
    const temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);

    // Send both temperatures as JSON
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        celsius: temperatureCelsius,
        fahrenheit: temperatureFahrenheit.toFixed(1), // Round to 1 decimal
      })
    );
  } else if (req.url === "/style.css") {
    // Serve the CSS file
    fs.readFile("style.css", (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("Stylesheet not found");
      } else {
        res.setHeader("Content-Type", "text/css");
        res.end(data);
      }
    });
  } else if (req.url === "/script.js") {
    // Serve JavaScript dynamically
    const jsCode = `
      function fetchTemperature() {
        fetch("/temperature")
          .then(response => response.json())
          .then(data => {
            document.getElementById("temperature-celsius").textContent = data.celsius;
            document.getElementById("temperature-fahrenheit").textContent = data.fahrenheit;
          })
          .catch(error => console.error("Error fetching temperature:", error));
      }

      setInterval(fetchTemperature, 5000); // Fetch every 5 seconds
      fetchTemperature(); // Initial fetch
    `;

    res.setHeader("Content-Type", "application/javascript");
    res.end(jsCode);
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

// Start server on port 3000
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
