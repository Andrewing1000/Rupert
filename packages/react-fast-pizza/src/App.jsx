import React from 'react';
//import { BrowserRouter, Route , Routes }  from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './ui/Home';
import Menu, { loader as menuLoader } from './features/Menu/Menu';
import Cart from './features/Cart/Cart';
import Order, { loader as orderLoader } from './features/Order/Order';
import CreateOrder, {
  action as createOrderAction,
} from './features/Order/CreateOrder';
import AppLayout from './ui/AppLayout';
import Error from './ui/Error';
const router = createBrowserRouter([
  //======================CARAJO MIERDA WAY(IMPERATIVE)
  {
    element: <AppLayout />, //This way is required to allow data loader
    //data is loaded as the element is rendered when the router requires it
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/menu',
        element: <Menu />, //Convention mandates to place
        //each loader function in the files corresponding to the element
        //  that cosumes the corresponding data
        loader: menuLoader,
        errorElement: <Error />, //If not present, the error event bubbles up to the parent element
        //and gets consumed by the first instance that includes it
      },
      {
        path: '/cart',
        element: <Cart />,
      },
      {
        path: '/order/new',
        element: <CreateOrder />,
        action: createOrderAction,
      },
      {
        path: '/order/:orderId',
        element: <Order />,
        loader: orderLoader,
        errorElement: <Error />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;

  // return <BrowserRouter> //===============DECLARATIVE WAY
  //   <Routes>
  //     <Route index path="/" element={<Menu/>}/>
  //     <Route path="me" element={<Home/>}/>
  //    <Router path="*" element={<PageNotFound/>}/>
  //   </Routes>
  // </BrowserRouter>
}

export default App;
