import { useState } from "react"
import { getAccount, login } from "../api"

export default function Login() {
  const [sellerId, setSellerId] = useState("")
  const [sellerPrefix, setSellerPrefix] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    login({ seller_id: sellerId, seller_zip_code_prefix: sellerPrefix })
      .then(() => getAccount())
      .then(() => {
        window.location.reload()
      })
      .catch((err) => {
        setError(err.response?.data.error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="w-full max-w-sm md:max-w-none mx-auto my-12 flex flex-col items-center justify-center gap-y-5 shadow-2xl rounded-xl border md:my-auto lg:mt-4 lg:mb-0 lg:flex-1 px-4 py-6">
      <div>
        <h4 className="text-2xl">Please login to continue</h4>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="seller id"
          className="border w-full py-2 px-3 rounded-md"
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
        />
        <input
          type="text"
          placeholder="seller zip code prefix"
          className="border w-full py-2 px-3 rounded-md"
          value={sellerPrefix}
          onChange={(e) => setSellerPrefix(e.target.value)}
        />

        <button className="bg-blue-600 text-white rounded-md py-2 font-semibold w-full">
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  )
}
