import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from "./screens/Home";
import Auth from "./screens/Auth";
import AddPost from "./screens/AddPost";
import ViewPost from "./screens/ViewPost";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/snippet/add",
    element: <AddPost />,
  },
  {
    path: "/snippet/:id",
    element: <ViewPost />,
  }
]);

function App() {





  return (
    <>
          <RouterProvider router={router} />
    </>
  )
}

export default App
