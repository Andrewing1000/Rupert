import { useQuiz } from "../contexts/QuizContext";
import React from "react";

export default function NextButton() {
  const { answer, dispatch } = useQuiz();
  if (answer === null) return null;

  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: "nextIndex" })}
    >
      Next
    </button>
  );
}
