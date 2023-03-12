import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getAccount, logout } from "../api"
import Login from "../containers/Login"
import Sellers from "../containers/Sellers"

export default function Layout({ title, children }) {
  const account = useQuery(["account"], getAccount)

  const handleLogout = () => {
    logout()
    window.location.reload()
  }

  return (
    <div className="min-h-screen md:max-h-screen divide-x flex flex-col md:flex-row">
      <div className="md:w-3/5 lg:w-4/6 p-6 flex flex-col">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <h2 className="font-bold text-2xl">{title}</h2>

          <div className="flex flex-wrap items-center gap-x-2">
            <Link to="/">
              <button className="text-blue-600 px-3 py-2 underline text-sm font-medium">Home</button>
            </Link>
            {account.data && (
              <>
                <Link to="/account">
                  <button className="text-blue-600 px-3 py-2 underline text-sm font-medium">Edit account</button>
                </Link>
                <button onClick={handleLogout} className="text-red-400 px-3 py-2 underline text-sm font-medium">Logout</button>
              </>
            )}
          </div>
        </div>

        {account.data ? children : <Login />}
      </div>

      <div className="md:w-2/5 lg:w-2/6 flex flex-col gap-y-4 bg-gray-50 p-6 overflow-hidden">
        <Sellers />
      </div>
    </div>
  )
}
