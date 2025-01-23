import { useQuiz } from "../contexts/QuizContext";
import React from "react";

export default function StartScreen() {
  const { questions = 0, dispatch } = useQuiz();

  const numQuestions = questions?.length ?? 0;
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-iu"
        onClick={() => {
          dispatch({ type: "start" });
        }}
      >
        Let&apos;s start
      </button>
    </div>
  );
}

// StartScreen.propTypes = {
//     numQuestions: PropTypes.string.isRequired,
//     dispatch: PropTypes.function name(params) {

//     }
// }
