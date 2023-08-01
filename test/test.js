// test/test.js
const fs = require("fs");
const chai = require("chai");
chai.use(require("chai-json"));
const expect = chai.expect;
const request = require("supertest");
const app = require("../server");
const getParsedData = require("../services/get_parsed_data_service.cjs");

describe("health", () => {
  // Test case for getting all users
  it("should be healthy", (done) => {
    request(app)
      .get("/health")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
        expect(res.body.message).to.equal("Server is up and running");
        done();
      });
  });

  it("should parsed correctly", (done) => {
    const html = fs.readFileSync(
      "./test/test_data/crunch-fitness-san-mateo-san-mateo-2.html",
      "utf8"
    );
    const reviewsJson = fs.readFileSync(
      "./test/test_data/crunch-fitness-reviews.json",
      "utf8"
    );
    getParsedData(html)
      .then(({parsed_data,error}) => {
        expect(parsed_data.activities).to.be.eql([]);
        expect(parsed_data.description).to.equal(
          "Crunch gym in San Mateo, CA fuses fitness & fun through awesome group fitness classes, miles of cardio, top-notch equipment, and personal training, all in month-to-month memberships! Come check us out today and see how we keep it So Fresh & So Clean!"
        );
        expect(parsed_data.address).to.eql("1150 Park Pl San Mateo, CA 94403");
        expect(parsed_data.zip).to.eql("94403");
        // expect(reviewsJson).to.be.jsonObj(parsed_data.featured_review);
        expect(parsed_data.attributes).to.eql(["Gyms", "Trainers", "Yoga"]);
        expect(parsed_data.venue_name).to.eql("Crunch Fitness - San Mateo");
        expect(parsed_data.rating_average).to.eql(3.3);
        done();
      })
      .catch(done);
  });
});
