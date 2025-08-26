import NotFound from "@/Page/NotFound";
import { createBrowserRouter } from "react-router-dom";
import Main from "@/Page/Main";
import Test from "@/Page/Test";
import MyPage from "@/Page/MyPage";

export const routes = createBrowserRouter([
  {
    index: true,
    Component: Main,
    loader: () => console.log("Loader 위치"),
  },
  {
    path: "test",
    Component: Test,
  },
  {
    path: "mypage",
    Component: MyPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
