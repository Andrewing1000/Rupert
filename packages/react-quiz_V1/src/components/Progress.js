import { useQuiz } from "../contexts/QuizContext";
import React from "react";

export default function Progress() {
  const { score: points, questions, index, maxPossiblePoints, answer } = useQuiz();
  const numQuestions = questions?.length ?? 0;
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={index - 1 + Number(answer !== null)}
      />
      <p>
        Question <strong>{index}</strong> / {numQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}
