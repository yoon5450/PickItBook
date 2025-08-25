import Main from "@/Page/Main";
import Root from "@/Page/Root";
import NotFound from '@/Page/NotFound';
import { createBrowserRouter } from "react-router";
import Test from "@/Page/Test";

export const routes = createBrowserRouter([
  {
    path: '/',
    Component:Root,
    children: [
      {
        index:true,
        Component:Main,
        loader:() => console.log('loader 위치')
      }
      ,{
        path:'test',
        Component:Test,
      }
    ],
  },
  {path:"*", Component: NotFound}

])