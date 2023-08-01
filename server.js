// server.js
const express = require("express");
const bodyParser = require("body-parser");
const getHtmlBody = require("./services/get_html_body_service.cjs");
const getParsedData = require("./services/get_parsed_data_service.cjs");
const Counter = require("./services/counter.cjs");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware to parse JSON data in request bodies
app.use(bodyParser.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ message: "Server is up and running" });
});

app.post("/api/parse", async (req, res) => {
  let response_url = '';
  try {
    const data = req.body;
    const yelp_url = data.yelp_url;
    const html_body = await getHtmlBody(yelp_url);
    response_url = (new Counter().getCount())+'.html';
    fs.writeFileSync('saved_response/'+response_url, html_body);
    const {parsed_data,error} = await getParsedData(html_body);

    // clean the data
    const clean_data = {};
    for (let k in parsed_data) {
      if (parsed_data[k]) {
        clean_data[k] = parsed_data[k];
      }
      else {
        let field_name = '';
        const words = k.split('_');
        for ( let word of words) {
          field_name += word.charAt(0).toUpperCase() + word.slice(1) + ' ';
        }
        clean_data[k] = `No ${field_name.trim()} found`;
      }
    }

    // set undefined
    // clean the data
    for (let k in error) {
      if (clean_data[k]) {
        clean_data[k] = '';
      }
    }


    const sampleInput = `name = ${parsed_data.venue_name} description = ${parsed_data.description} address = ${parsed_data.address}\
     zipcode = ${parsed_data.zip} reviews = ${parsed_data.featured_review.map(e=>e.text).join(" ")} rating = ${parsed_data.rating_average} attributes = ${parsed_data.attributes}`;
    console.log(sampleInput);
    res.status(201).json({
      match: true,
      parsed_data : clean_data,
      error,
      response_url: '/saved_response/'+response_url,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      match: false,
      parsed_data: null,
      error: err.message,
      response_url: '/saved_response/'+response_url,
    });
  }
});

app.get("/saved_response/:response_url", async (req, res) => {
  const responseUrl = req.params.response_url;
  const html_file_data = fs.readFileSync('saved_response/'+responseUrl, 'utf8');
  res.status(200).send(html_file_data);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
