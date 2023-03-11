const services = require("../services")

module.exports = {
    async authorize(req, res, next) {
        // get authorixation header from request
        const authorization = req.headers.authorization ?? ""
        const base64Credentials = authorization.split(" ")[1]

        // check if header is present
        if (!base64Credentials) {
            return res.status(401).send({
                status: 401,
                error: "Missing credentials",
            })
        }

        // convert base64 credentials to string
        const credentials = Buffer.from(base64Credentials, "base64").toString()
        const parts = credentials.split(":")

        if (parts.length !== 2) {
            return res.status(401).send({
                status: 401,
                error: "Malformed credentials",
            })
        }

        // verify credentials
        const seller = await services.sellers.getOne({ seller_id: parts[0] })

        if (!seller || seller.seller_zip_code_prefix !== parts[1] ) {
            return res.status(401).send({
                status: 401,
                error: "Incorrect credentials",
            })
        }

        // populate req.user with credentials
        req.user = seller

        next()
    }
}
