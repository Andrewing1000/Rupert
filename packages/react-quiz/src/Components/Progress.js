import React, { Profiler } from "react";

export default function Progress({
  points,
  index,
  numQuestions,
  maxPossiblePoints,
  answer,
}) {
  return (
    <header className="progress">
    <progress max={numQuestions} 
    value={index - 1 +Number(answer !== null) }/>
      <p>
        Question <strong>{index}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}
