import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Link } from "react-router-dom"
import { getOrderItems } from "../api"
import Layout from "../layouts/Layout"

export default function Home() {
  const [expanded, setExpanded] = useState()
  const [offset, setOffset] = useState(0)
  const [limit] = useState(20)
  const [sort, setSort] = useState("")

  const orderItems = useQuery(["order_items", { offset, limit, sort }], () => getOrderItems({ offset, limit, sort }))

  const start = (offset * limit) + 1
  const end = (offset + 1) * limit

  const prev = () => {
    if (!orderItems.data) return
    setOffset(Math.max(offset - 1, 0))
  }

  const next = () => {
    if (!orderItems.data) return
    setOffset(Math.min(offset + 1, Math.ceil(orderItems.data.total / limit) - 1))
  }

  return (
    <Layout title="Order Items">
      <div className="flex flex-col flex-1 overflow-hidden mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-xl">Showing {orderItems.data && <small>({start} - {end} of {orderItems.data.total})</small>}</h3>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border">
            <option value="">Sort by</option>
            <option value="date">Date (asc)</option>
            <option value="-date">Date (desc)</option>
            <option value="price">Price (asc)</option>
            <option value="-price">Price (desc)</option>
          </select>
        </div>

        <ul className="flex flex-col gap-y-4 overflow-y-scroll flex-1">
          {orderItems.data?.data.map((orderItem, i) => (
            <li key={i} className="border rounded-lg px-3 py-3">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div>
                    <p className="text-xs text-gray-500">seller id</p>
                    <p className="font-medium">{orderItem.id} - <span className="font-normal">{orderItem.product_category}</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">price</p>
                    <p className="font-medium">{orderItem.price}</p>
                  </div>
                  {expanded === i && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500">date</p>
                        <p className="font-medium">{new Date(orderItem.date).toDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">product category</p>
                        <p className="font-medium">{orderItem.product_category}</p>
                      </div>
                    </>
                  )}
                </div>

                <button
                  className="text-blue-600 px-3 py-2 underline text-sm font-medium"
                  onClick={() => setExpanded(curr => curr === i ? undefined : i)}
                >
                  {expanded === i ? "Hide" : "View"}
                </button>
              </div>

              {expanded === i && (
                <div className="mt-1 flex items-center justify-end gap-x-3">
                  <button className="bg-red-100 text-red-400 rounded-md px-3 py-1 text-sm font-medium">Delete</button>
                  <Link to={`/order_items/${orderItem.id}`}>
                    <button className="bg-blue-600 text-white rounded-md px-3 py-1 text-sm font-medium">Edit</button>
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-4">
          <button onClick={prev} className="bg-blue-600 text-white rounded-md px-5 py-1.5 text-sm font-medium">Prev</button>
          <button onClick={next} className="bg-blue-600 text-white rounded-md px-5 py-1.5 text-sm font-medium">Next</button>
        </div>
      </div>
    </Layout>
  )
}
