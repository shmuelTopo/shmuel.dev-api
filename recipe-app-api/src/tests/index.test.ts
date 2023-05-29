import supertest from "supertest";
import server from "../index";

describe("Server", function () {
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it("should GET /", async () => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
    expect(res.body).toEqual("server is up and running");
  });

  it("should handle 404", async () => {
    const res = await request.get("/foobar");
    expect(res.status).toBe(404);
  });
});
