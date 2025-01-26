import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <App /> */}
    <div
      style={{
        background: "#1f686bff",
        position: "static",
        aspectRatio: "3/4",
        display: "inline-block",
      }}
    >
      <svg
        style={{
          width: "100%",
          height: "200px",
          overflow: "hidden",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="grayscale">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    -1 -1 -1 1 0"
            />
          </filter>

          <filter id="lopez">
            <feColorMatrix
              type="matrix"
              values="-0.9 -0.9 -0.9 0 0.7
                    -0.9 -0.9 -0.9 0 0.5
                    -0.9 -0.9 -0.9 0 0.7
                    0 0 0 1 0"
            />
          </filter>

          <filter id="videla">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    1.8 1.8 1.8 0 -1"
            />
          </filter>

          <filter id="low">
            <feColorMatrix
              type="matrix"
              value="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0"
            />
          </filter>

          <filter id="exponential">
            <feComponentTransfer>
              <feFuncA type="gamma" amplitude="1" exponent="0.5" offset="0" />
            </feComponentTransfer>
          </filter>
        </defs>

        <image
          href="/coco.png"
          x="0"
          y="0"
          style={{
            // justifySelf: "center",
            width: "110%",
            height: "200%",
          }}
          // object-fit="cover"
          // filter=" url(#lopez) url(#grayscale) "
          filter="url(#lopez) url(#grayscale)   url(#exponential)"
        />
      </svg>
      <div
        style={{
          padding: "1rem",
          position: "relative",
          bottom: "0rem",
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Jose Luis Peña
        </h1>
      </div>
    </div>
  </React.StrictMode>,
);

//PLANNING THE APPLICATION

//-------> For small apps <----------
//1 Breaking the app in components
//2 Built a static version at first
//3 Think of data from and state management

//-------> For bigger apps <----------
//Preliminary outline:

//1 Gather application requirements and features (Functional and non fucntional requirements)
//2 Dive the app into pages
//      Think about the overall and page-level UI
//      Break the desider UI into compoenets
//      Design and build a static version
//3 Divide the functionalities in features
//      Think about state management and data flow
//4 Choose the implementation tools (libraries)

//Steps 2 and 3 are addressed simultaneously because both
//depend on each other

//Feature Categories:
//User
//Menu
//Cart
//Order

//Necessary Pages:
//User --> Homepage
//Menu --> Pizza menu
//Cart --> Cart
//Order --> Placing a new order
//Order --> Looking up a past order

//Feature categories map well to the state domains / satate slices

//Types of State
//User --> Global UI State
//Menu --> Global remote
//Cart -->  Global UI state
//Order --> Global remote (submited and fetched from an external)

//Choosing the implementation tools

//Routing: React Router
//Styling: tailwind
//Remote State: React Router (render as you fetch since version 6)
//UI State: Redux

////////////////////////////////////////////////////////////////////////////

//Big projects are better organized in features now
//each feature object is selfcontained expect for reusable general components

//services folder: for api related logic
//utilites folder: reusable stateless functions
//hooks --> now go into the features folder
//contexts --> now go into the features folder
//pages --> now go into the features folder
