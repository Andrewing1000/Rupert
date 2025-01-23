import React from "react";
import ReactDOM from "react-dom/client"; //Default imports
import "./index.css";
import App from "./components/App";
import { QuizProvider } from "./contexts/QuizContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QuizProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </QuizProvider>
);
