import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000/";

const initialState = {
  cities: [],
  isLoading: false,
  error: "",
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "rejected":
      return { ...state, error: action.payload, isLoading: false };
    case "city/selected":
      return { ...state, currentCity: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payload],
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((c) => c.id !== action.payload),
        isLoading: false,
        currentCity: {},
      };
    default:
  }
}

function CitiesProvider({ children }) {
  const [{ error, cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function request() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();
        // console.log(data);
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        // alert("There was an error loadin data", err.message);
        dispatch({
          type: "rejected",
          payload: "There was an error loading the data",
        });
      }
    }

    request();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    // console.log("fetchenado")

    if (Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}cities/${id ?? 0}`);
      const data = await res.json();
      dispatch({ type: "city/selected", payload: data });
    } catch {
      dispatch({ type: "rejected", payload: "Error fetching the city" });
    }
  }, []);

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
      console.log(data);
    } catch (err) {
      alert("There was an error creating the city");
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      alert("Error deleting the data");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        createCity,
        deleteCity,
        cities,
        isLoading,
        currentCity,
        getCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
