import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getSellers } from "../api"

export default function Sellers() {
  const [offset, setOffset] = useState(0)
  const [limit] = useState(20)

  const sellers = useQuery(["sellers", { offset, limit }], () => getSellers({ offset, limit }))

  const start = (offset * limit) + 1
  const end = (offset + 1) * limit

  const prev = () => {
    if (!sellers.data) return
    setOffset(Math.max(offset - 1, 0))
  }

  const next = () => {
    if (!sellers.data) return
    setOffset(Math.min(offset + 1, Math.ceil(sellers.data.total / limit) - 1))
  }

  return (
    <>
      <h2 className="font-bold text-2xl">Sellers {sellers.data && <small>({start} - {end} of {sellers.data.total})</small>}</h2>

      <div className="flex flex-col flex-1 overflow-hidden">
        <ul className="space-y-2 overflow-y-scroll flex-1">
          {sellers.data?.data.map((seller) => (
            <li key={seller.seller_id} className="rounded-md border px-4 py-2">
              <p className="text-xs text-gray-500">seller id</p>
              <p className="font-medium text-sm">{seller.seller_id}</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="mt-2 text-xs text-gray-500">seller zip code prefix</p>
                  <p className="text-sm">{seller.seller_zip_code_prefix}</p>
                </div>
                <div>
                  <p className="mt-2 text-xs text-gray-500">city / state</p>
                  <p className="text-sm">{seller.seller_city} / {seller.seller_state}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-4">
          <button onClick={prev} className="bg-blue-600 text-white rounded-md px-5 py-1.5 text-sm font-medium">Prev</button>
          <button onClick={next} className="bg-blue-600 text-white rounded-md px-5 py-1.5 text-sm font-medium">Next</button>
        </div>
      </div>
    </>
  )
}
