const request = require("supertest")
const { app } = require("../app")
const { db } = require("../lib/db")

beforeAll(db.connect)
afterAll(db.close)

const req = request(app)

describe("restirct access to authorized requests only", () => {
    test("no credentials", async () => {
        const res = await req.get("/account")

        expect(res.statusCode).toBe(401)
        expect(res.body).toStrictEqual({ status: 401, error: "Missing credentials" })
    })

    test("malformed credentials", async () => {
        const res = await req.get("/account").set("Authorization", "Bearer myname:mypass")

        expect(res.statusCode).toBe(401)
        expect(res.body).toStrictEqual({ status: 401, error: "Malformed credentials" })
    })

    test("incorrect credentials", async () => {
        const res = await req.get("/account").auth("myname", "mypass")

        expect(res.statusCode).toBe(401)
        expect(res.body).toStrictEqual({ status: 401, error: "Incorrect credentials" })
    })
})
