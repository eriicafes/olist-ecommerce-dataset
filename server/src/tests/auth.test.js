const request = require("supertest")
const { app } = require("../app")

describe("restirct access to authorized requests only", () => {
    test("no credentials", async () => {
        const res = await request(app).get("/account")

        expect(res.statusCode).toBe(401)
        expect(res.body).toStrictEqual({ status: 401, error: "Missing credentials" })
    })

    test("malformed credentials", async () => {
        const res = await request(app).get("/account").set("Authorization", "Bearer myname:mypass")

        expect(res.statusCode).toBe(401)
        expect(res.body).toStrictEqual({ status: 401, error: "Malformed credentials" })
    })

    test("correct credentials", async () => {
        const credentials = {
            seller_id: "myname",
            seller_zip_code_prefix: "mypass"
        }

        const res = await request(app).get("/account").auth(credentials.seller_id, credentials.seller_zip_code_prefix)

        expect(res.statusCode).toBe(200)
        expect(res.body).toStrictEqual(credentials)
    })
})
