const request = require("supertest");
const app = require("../src/app");

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/user")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});