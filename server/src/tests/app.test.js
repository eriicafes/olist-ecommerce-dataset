const request = require("supertest")
const { app } = require("../app")

describe("application", () => {
    it("should ping pong", async () => {
        const res = await request(app).get("/")

        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual({ ping: "pong" })
    })
})
