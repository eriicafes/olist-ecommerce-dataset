import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
import EditAccount from "./pages/EditAccount";
import EditOrderItem from "./pages/EditOrderItem";
import Home from "./pages/Home"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/account" element={<EditAccount />} />
      <Route path="/order_items/:id" element={<EditOrderItem />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
)

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
