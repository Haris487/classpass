const cheerio = require('cheerio');
const { get } = require('../server');

// write empty functions for each of the data points we want to scrape
const getActivities = ($) => {
  //unable to find activities on yelp
  return [];
}

const getDescription = ($) => {
  // get the heading About the Business
  const aboutThebusinessElement = $('h2:contains("About the Business")');
  const description = $(aboutThebusinessElement[0].parent.parent.parent).text().replace('About the Business','').trim();
  const trimed_desc =  description.replace(/\….*$/, '');
  return trimed_desc;
}

const getAddress = ($) => {
  // Find the element with text "Get Directions"
  const getDirectionsElement = $('a:contains("Get Directions")');
  const address = $(getDirectionsElement[0].parent.parent).text().replace('Get Directions','').trim();
  return address;
}

const getZip = ($) => {
  const address = getAddress($);
  const matches = address.match(/\b[A-Z]{2}\s+\d{5}(-\d{4})?\b/);
  const zip = matches[0].split(' ')[1];
  return zip;
}

const getFeaturedReview = ($) => {
  // what is featured review?
  return '';
}

const getAttributes = ($) => {
  const elementsWithReviewsHref = $('a[href="#reviews"]');
  const getParent = elementsWithReviewsHref[0].parent.parent.parent.parent;
  const children = getParent.children;
  let attributes_elem = null;
  for (let i = 0 ; i < children.length; i++){
    const child_text = $(children[i]).text();
    if (child_text.includes(',')){
      attributes_elem = children[i];
      break;
    }
  }
  if(attributes_elem == null){
    attributes_elem = elementsWithReviewsHref[0].parent.parent.parent.parent.children[3];
  }
  const attributesText = $(attributes_elem).text();
  const attributes = attributesText.split(',');

  for (let i = 0 ; i < attributes.length; i++){
    attributes[i] = attributes[i].trim();
  }

  return attributes;
}

const getVenueName = ($) => {
  // what is venue name?
  return '';
}

const getRatingAverage = ($) => {
  // get element where the reviews in written
  const elementsWithReviewsHref = $('a[href="#reviews"]');
  const getParentText = $(elementsWithReviewsHref[0].parent.parent).text();
  const ratingText = getParentText.split(' ')[0];
  const rating = parseFloat(ratingText);
  return rating;
}

module.exports =  async (html) => {
  // Use Cheerio to parse the HTML content
  const $ = cheerio.load(html);

  const parsedData = {
    activities : getActivities($),
    description : getDescription($),
    address : getAddress($),
    zip : getZip($),
    featured_review : getFeaturedReview($),
    attributes : getAttributes($),
    venue_name : getVenueName($),
    rating_average : getRatingAverage($)
  };

  return parsedData;
}