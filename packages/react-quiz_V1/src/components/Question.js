import React from "react";
import Options from "./Options";
import { useQuiz } from "../contexts/QuizContext";

export default function Question() {
  const { questions, answer, dispatch, index} = useQuiz();
  // console.log(question)
  const question = questions[index];
  return (
    <div>
        <h4>{question.question}</h4>
        <Options 
        question={question} 
        answer={answer}
        dispatch={dispatch}></Options>
    </div>
  );
}
