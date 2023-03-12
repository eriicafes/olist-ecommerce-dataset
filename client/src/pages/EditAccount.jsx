import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAccount, updateAccount } from "../api"
import Layout from "../layouts/Layout"

export default function EditAccount() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [sellerCity, setSellerCity] = useState("")
  const [sellerState, setSellerState] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const account = useQuery(["account"], getAccount, {
    retry: false,
    onSuccess(res) {
      setSellerCity(res.data.seller_city)
      setSellerState(res.data.seller_state)
    },
    onError() {
      navigate("/")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    updateAccount({ seller_city: sellerCity, seller_state: sellerState })
      .then(() => {
        account.refetch()
        queryClient.invalidateQueries(["sellers"])
      })
      .catch((err) => {
        setError(err.response?.data.error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (!account.data) return null

  return (
    <Layout title="Edit Account">
      <div className="flex flex-col flex-1 overflow-hidden mt-4">
        <div className="flex flex-col gap-y-5">
          <h4 className="text-2xl">Update Account</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="seller city"
              className="border w-full py-2 px-3 rounded-md"
              value={sellerCity}
              onChange={(e) => setSellerCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="seller state"
              className="border w-full py-2 px-3 rounded-md"
              value={sellerState}
              onChange={(e) => setSellerCity(e.target.value)}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button className="bg-blue-600 text-white rounded-md py-2 font-semibold w-full">
              {loading ? "Loading..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
