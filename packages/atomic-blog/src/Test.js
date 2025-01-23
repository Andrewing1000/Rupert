import { useState } from "react";

function SlowComponent() {
  // If this is too slow on your maching, reduce the `length`
  const words = Array.from({ length: 100_000 }, () => "WORD");
  return (
    <ul>
      {words.map((word, i) => (
        <li key={i}>
          {i}: {word}
        </li>
      ))}
    </ul>
  );
}

export function Counter({children}){
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Slow counter?!?</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
      {children}
    </div>
  );
}

export default function Test() {
  // const [count, setCount] = useState(0);
  // return (
  //   <div>
  //     <h1>Slow counter?!?</h1>
  //     <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
  //     <SlowComponent /> 
  //     {/* Not optimized by default,
  //     this Slow component does in fact rerender each of the
  //     100000 children when the counter changes */}
  //   </div>
  // );
  return <div>
    <h1>Slow counter?</h1>
    <Counter>
      <SlowComponent/>
    </Counter>
    {/* This solves the problem, since parsing the 
    children as prop let react know that
    the children component does not depend on the parent's 
    state which decouples both elements when redering takes 
    place in the parent*/}
  </div>
}
