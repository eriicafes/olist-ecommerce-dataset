import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getOrderItem, updateOrderItem } from "../api"
import Layout from "../layouts/Layout"

export default function EditOrderItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [date, setDate] = useState("")
  const [price, setPrice] = useState(0)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const orderItem = useQuery(["order_item", "detail", id], () => getOrderItem({ id }), {
    retry: false,
    onSuccess(res) {
      setDate(res.data.date.slice(0, 10))
      setPrice(res.data.price)
    },
    onError() {
      navigate("/")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    updateOrderItem({ id, date, price })
      .then(() => {
        orderItem.refetch()
        queryClient.invalidateQueries(["order_items"])
      })
      .catch((err) => {
        setError(err.response?.data.error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (!orderItem.data) return null

  return (
    <Layout title="Edit Order Item">
      <div className="flex flex-col flex-1 overflow-hidden mt-4">
        <div className="flex flex-col gap-y-5">
          <h4 className="text-2xl">Update Order Item</h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="date"
              placeholder="date"
              className="border w-full py-2 px-3 rounded-md"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="number"
              placeholder="price"
              className="border w-full py-2 px-3 rounded-md"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
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
