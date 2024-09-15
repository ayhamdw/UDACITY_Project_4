const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch"); // for making API requests
require("dotenv").config(); // to load environment variables

const app = express();
app.use(cors());
// Use body-parser to handle incoming JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("dist"));

// MeaningCloud API setup
const MEANINGCLOUD_API_URL =
  "https://api.meaningcloud.com/deepcategorization-1.0";
const API_KEY = process.env.MEANINGCLOUD_API_KEY;

// Home route to serve the index page
app.get("/", function (req, res) {
  res.sendFile("dist/index.html");
});

// Route to handle text analysis using MeaningCloud
app.post("/analyze", async (req, res) => {
  const { input } = req.body;
  if (!input) {
    return res.status(400).json({ error: "Text input is required" });
  }

  try {
    // Make a request to the MeaningCloud API
    const response = await fetch(
      `${MEANINGCLOUD_API_URL}?key=${API_KEY}&txt=${encodeURIComponent(
        input
      )}&model=IAB_2_en`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (response.ok && data) {
      res.json({
        category: data.category_list[0].label,
        confidence: data.category_list[0].relevance,
        text: input,
      });
    } else {
      res.status(response.status).json({ error: "Failed to analyze the text" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(8081, function () {
  console.log("Server is listening on port 8081!");
});
