import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Product from "./pages/Product";
// import Pricing from "./pages/Pricing";
// import Homepage from "./pages/Homepage";
// import Login from "./pages/Login";
// import AppLayout from "./pages/AppLayout";
// import PageNotFound from "./pages/PageNotFound";

//==========================================================
//LAZY LOADING

const Product = lazy(() => import("./pages/Product")); //reacts lazy function
const Pricing = lazy(() => import("./pages/Pricing"));
const Homepage = lazy(() =>import( "./pages/Homepage"));
const Login = lazy(() => import("./pages/Login"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

import CityList from "./components/CityList";
import CountriesList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import ProtectedRouter from "./components/ProtectedRouter";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContext";
import SpinnerFullPage from "./components/SpinnerFullPage";

export default function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="/product" element={<Product />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
              <Route
                path="app"
                element={
                  <ProtectedRouter>
                    <AppLayout />
                  </ProtectedRouter>
                }
              >
                <Route
                  index
                  path=""
                  element={<Navigate replace to="cities" />}
                  // NAVIGATE components is basically a redirect
                />
                <Route index path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountriesList />} />
                <Route path="form" element={<Form />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        {/* this as is, changes pages reloading the entire tab */}
      </CitiesProvider>
    </AuthProvider>
  );
}

//Routing: MATCH URLS TO UI VIEWS
//In react that is URLS to COMPONENTS

//Keeps UI in sync with the current browser URL
//This is client side routing -> SPA
//The page is never reloaded --> Desktop app experience

//Router link triggers a DOM update instead of a page reload

//Handler by React Router
