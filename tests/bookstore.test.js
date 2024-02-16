const supertest = require("supertest");
const app = require("../app"); // Assuming your Express app file is named app.js

const api = supertest(app);

describe("Bookstore API", () => {
  let token;
  before(async () => {
    const response = await api
      .post("/api/v1/auth/login")
      .send({ email: "random@gmail.com", password: "random123" });
    token = response.body.data;
  });

  it("should get all books", async () => {
    const response = await api
      .get("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /json/);
  });

  it("should get a specific book by ID", async () => {
    const bookId = 1;

    const response = await api
      .get(`/api/v1/books/${bookId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
