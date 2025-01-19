import React, { useReducer, useState } from "react";

const initialState = {count: 0, step: 1} 
function reducer(currentState, action){
  
  let {count, step} = currentState
  
  // console.log(count, step, action, currentState)
  switch(action.type){                          //Switch are frecuent in reduce functions
    case "inc": count += step ?? 1; break;
    case "dec": count -= step ?? 1; break;
    case "setStep": step = action.payload ?? 1; break;
    case "setCount": count = action.payload ?? 0; break;
    case "reset": return initialState
    default:
      throw new Error("Unkown action")
  }
  return {...currentState, count, step}
}

//this reducer function decouples the state transition logic from the component declaration
//reducer must be a pure a function
function DateCounter() {
  // const [step, setStep] = useState(1);
  // const [step, setStep] = useState(1);  We can use useReducer instead of useState
  //for more granular control
  
  const [state, dispatch] = useReducer(reducer, initialState)

  const {count, step} = state //patter matching: destructuring

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - 1);
    // setCount((count) => count - step);

    // dispatch({type: "dec", payload: step})
    dispatch({type: "dec"})
  };

  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);

    // dispatch({type: "inc", payload: step})
    dispatch({type: "inc"})
  };

  const defineCount = function (e) {
    dispatch({type: "setCount", payload: Number(e.target.value).toFixed(0)}); // reducer(action: Object)
  };

  const defineStep = function (e) {
    dispatch({type:"setStep", payload: Number(e.target.value)})
    // setStep(Number(e.target.value));
  };

  const reset = function () {
    dispatch({type: "reset"})
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count}
        type="number"
        onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
