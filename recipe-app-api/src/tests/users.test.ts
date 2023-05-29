import supertest from "supertest";
import server from "../index";

describe("Server", function () {
  const request = supertest.agent(server);

  afterAll((done) => {
    server.close(done);
  });

  it("should POST new user /users", async () => {
    const res = await request.post("/users/").send({
      first: "Donald",
      last: "Trump",
      username: `trump2024`,
      email: `trump@mail.com`,
    });
    expect(res.status).toBe(201);
    expect(res.body.first).toBe("Donald");
  });

  it("should GET /users", async () => {
    const res = await request.get("/users");
    const donald = res.body.find((u: any) => (u.first = "Donald"));

    expect(res.status).toBe(200);
    expect(donald.last).toEqual("Trump");
  });

  it("should GET /users/:username", async () => {
    const res = await request.get("/users/trump2024");
    expect(res.status).toBe(200);
    expect(res.body.first).toBe("Donald");
  });

  it("should reject POST new user /users if info is missing", async () => {
    const res = await request.post("/users/").send({
      first: "Joe",
      last: "Biden",
    });
    expect(res.status).toBe(422);
  });

  it("should reject POST new user if user already exist /users", async () => {
    const newUser = {
      first: "Joe",
      last: "Biden",
      username: `biden2020`,
      email: 'biden@mail.com',
    };
    const res1 = await request.post("/users/").send(newUser);
    const res2 = await request.post("/users/").send(newUser);

    expect(res1.status).toBe(201);
    expect(res2.status).toBe(409);
  });

  it("should handle GET of user that doesn't exists", async () => {
    const res = await request.get("/users/foobar");
    expect(res.status).toBe(404);
    expect(res.body).toEqual("user not found");
  });

  it("should handle 404", async () => {
    const res = await request.get("/foobar");
    expect(res.status).toBe(404);
  });
});
