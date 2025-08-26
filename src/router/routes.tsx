import Main from "@/Page/Main";
import Root from "@/Page/Root";
import NotFound from '@/Page/NotFound';
import { createBrowserRouter } from "react-router";
import Test from "@/Page/Test";
import Search from "@/Page/Search";
import AuthLayout from "@/Page/Auth/AuthLayout";
import Login from "@/Page/Auth/Login";
import { guestLoader } from "@/Page/Auth/utils/guestLoader";
import MyPage from "@/Page/MyPage";

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: Main,
        loader: () => console.log('loader 위치')
      },
      {
        path: 'test',
        Component: Test,
      },
      {
        path: 'search',
        Component: Search
      },
      {
        path: 'auth',
        Component: AuthLayout,
        HydrateFallback: () => <p>데이터 로딩 중...</p>,
        children: [
          { path: 'login', Component: Login, loader: guestLoader },
        ]
      },
      {
        path: "mypage", 
        Component: MyPage,  
      },
    ],
  },
  { path: "*", Component: NotFound }

])