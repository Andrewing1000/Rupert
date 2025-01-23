import { useQuiz } from "../contexts/QuizContext";
import React from "react";

export default function Options() {
  const { questions, index, answer, dispatch } = useQuiz();
  const hasAnswer = answer != null;
  const question = questions[index];

  return (
    <div className="options">
      {question.options.map((option, index) => {
        return (
          <button
            className={`btn btn-option
                    ${index === answer ? "answer" : ""}
                    ${
                      hasAnswer
                        ? index === question.correctOption
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
            key={option}
            disabled={hasAnswer}
            onClick={() => {
              dispatch({
                type: "newAnswer",
                payload: index,
              });
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
