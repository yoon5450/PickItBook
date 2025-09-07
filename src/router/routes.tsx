import Main from "@/Page/Main";
import Root from "@/Page/Root";
import NotFound from "@/Page/NotFound";
import { createBrowserRouter } from "react-router";
import Test from "@/Page/Test";
import Search from "@/Page/Search";
import Login from "@/Page/Auth/Login";
import { guestLoader } from "@/Page/Auth/utils/guestLoader";
import MyPage from "@/Page/MyPage";
import Library from "@/Page/Library";
import BookDetail from "@/Page/BookDetail";
import Roulette from "@/Page/Roulette";



export const routes = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Main,
      },
      {
        path: "test",
        Component: Test,
      },
      {
        path: "search",
        Component: Search,
      },
      {
        path: "book_detail",
        Component: BookDetail
      },
      {
        path: "login",
        Component: Login,
        loader: guestLoader
      },
      {
        path: "mypage",
        Component: MyPage,
      },
      {
        path: "library",
        Component: Library,
      },
      {
        path: 'roulette',
        Component: Roulette,
      },
    ]
  },

  { path: "*", Component: NotFound }
])

