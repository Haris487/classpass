const cheerio = require("cheerio");
const { get } = require("../server");
const { default: e } = require("express");

// write empty functions for each of the data points we want to scrape
const getActivities = ($) => {
  //unable to find activities on yelp
  return [];
};

const getDescription = ($) => {
  // get the heading About the Business
  const aboutThebusinessElement = $('h2:contains("About the Business")');
  const description = $(aboutThebusinessElement[0].parent.parent.parent)
    .text()
    .replace("About the Business", "")
    .trim();
  const trimed_desc = description.replace(/\….*$/, "").replace(/\n/," ");
  return trimed_desc;
};

const getAddress = ($) => {
  // Find the element with text "Get Directions"
  const getDirectionsElement = $('a:contains("Get Directions")');
  const address = $(getDirectionsElement[0].parent.parent)
    .text()
    .replace("Get Directions", "")
    .trim();
  return address;
};

const getZip = ($) => {
  const address = getAddress($);
  const matches = address.match(/\b[A-Z]{2}\s+\d{5}(-\d{4})?\b/);
  const zip = matches[0].split(" ")[1];
  return zip;
};

const getFeaturedReview = ($) => {
  // feature review is the review Heighlights

  const reviewSection = $("#reviews");
  const listReviewElement = $(reviewSection).find("ul");
  let reviews = [];

  const reviewsElements = listReviewElement[1].children;
  for (let i = 0; i < 4; i++) {
    const reviewElement = reviewsElements[i];
    const reviewAuthorElement =
      reviewElement.children[0].children[0].children[0].children[0].children[0]
        .children[0];
    const authorNameElement =
      reviewAuthorElement.children[1].children[0].children[0];
    const authorLocationElement =
      reviewAuthorElement.children[1].children[0].children[1];
    const authorName = $(authorNameElement).text();
    const authorLocation = $(authorLocationElement).text();
    const reviewTextElement = reviewElement.children[0].children[2];
    const reviewText = $(reviewTextElement).text();
    reviews.push({
      author: {
        name: authorName,
        location: authorLocation,
      },
      text: reviewText
    });
  }

  return reviews;
};

const getAttributes = ($) => {
  const elementsWithReviewsHref = $('a[href="#reviews"]');
  const getParent = elementsWithReviewsHref[0].parent.parent.parent.parent;
  const children = getParent.children;
  let attributes_elem = null;
  for (let i = 0; i < children.length; i++) {
    const child_text = $(children[i]).text();
    if (child_text.includes(",")) {
      attributes_elem = children[i];
      break;
    }
  }
  if (attributes_elem == null) {
    attributes_elem =
      elementsWithReviewsHref[0].parent.parent.parent.parent.children[3];
  }
  const attributesText = $(attributes_elem).text();
  const attributes = attributesText.split(",");

  for (let i = 0; i < attributes.length; i++) {
    attributes[i] = attributes[i].trim();
  }

  return attributes;
};

const getVenueName = ($) => {
  // what is venue name?
  const venue_name = $("h1.css-1se8maq");
  return venue_name.text();
};

const getRatingAverage = ($) => {
  // get element where the reviews in written
  const elementsWithReviewsHref = $('a[href="#reviews"]');
  const getParentText = $(elementsWithReviewsHref[0].parent.parent).text();
  const ratingText = getParentText.split(" ")[0];
  const rating = parseFloat(ratingText);
  return rating;
};

// wrap all functions in try catch block

const _getActivities = ($,e) => {
  try {
    return getActivities($);
  } catch (err) {
    console.log(err);
    e.activities = err.message;
    return [];
  }
};

const _getDescription = ($,e) => {
  try {
    return getDescription($);
  } catch (err) {
    console.log(err);
    e.description = err.message;
    return '';
  }
};

const _getAddress = ($,e) => {
  try {
    return getAddress($);
  } catch (err) {
    console.log(err);
    e.address = err.message;
    return '';
  }
};

const _getZip = ($,e) => {
  try {
    return getZip($);
  } catch (err) {
    console.log(err);
    e.zip = err.message;
    return '';
  }
};

const _getFeaturedReview = ($,e) => {
  try {
    return getFeaturedReview($);
  } catch (err) {
    console.log(err);
    e.featured_review = err.message; 
    return [];
  }
};

const _getAttributes = ($,e) => {
  try {
    return getAttributes($);
  } catch (err) {
    console.log(err);
    e.attributes = err.message;
    return []
  }
};

const _getVenueName = ($) => {
  try {
    return getVenueName($);
  } catch (err) {
    console.log(err);
    e.venue_name = err.message;
    return '';
  }
};

const _getRatingAverage = ($,e) => {
  try {
    return getRatingAverage($);
  } catch (err) {
    console.log(err);
    e.rating_average = err.message;
    return '';
  }
};

module.exports = async (html) => {
  // Use Cheerio to parse the HTML content
  const $ = cheerio.load(html);
  const e = {};

  const parsedData = {
    activities: _getActivities($,e),
    description: _getDescription($,e),
    address: _getAddress($,e),
    zip: _getZip($,e),
    featured_review: _getFeaturedReview($,e),
    attributes: _getAttributes($,e),
    venue_name: _getVenueName($,e),
    rating_average: _getRatingAverage($,e),
  };

  return {parsed_data:parsedData,error:e};
};
