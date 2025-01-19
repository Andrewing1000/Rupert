import React, {setState} from "react"
import ReactDOM from "react-dom/client" //Default imports
import "./index.css"
import App from "./Components/App"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
)