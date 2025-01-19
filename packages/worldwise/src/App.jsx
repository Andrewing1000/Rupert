import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Product from "./pages/Product";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing"
import PageNotFound from "./pages/NotFound"
import AppLayout from "./pages/AppLayout";
export default function App() {
  
  return <div>
    <h1>Not movable compoments</h1>
  
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="product" element={<Product/>}/>
      <Route path="pricing" element={<Pricing/>}/>
      <Route path="*" element={<PageNotFound/>}/>
      <Route path="/app" element={<AppLayout/>}/>
    </Routes>
  </BrowserRouter>  
  {/* this as is, changes pages reloading the entire tab */}
  </div>
}


//Routing: MATCH URLS TO UI VIEWS
//In react that is URLS to COMPONENTS

//Keeps UI in sync with the current browser URL
//This is client side routing -> SPA
//The page is never reloaded --> Desktop app experience

//Router link triggers a DOM update instead of a page reload

//Handler by React Router