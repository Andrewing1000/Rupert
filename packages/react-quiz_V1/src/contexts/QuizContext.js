import React, { createContext, useContext, useEffect, useReducer } from "react";

const S_PER_QUESTION = 10;

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
  highscore: 0,
  remainingSeconds: null,
};

function reducer(currentState, action) {
  // console.log(action.payload);
  switch (action.type) {
    case "dataReceived":
      return { ...currentState, status: "ready", questions: action.payload };
    case "dataFailed":
      return { ...currentState, status: "error" };
    case "start":
      return {
        ...currentState,
        status: "active",
        remainingSeconds: currentState.questions.length * S_PER_QUESTION,
      };
    case "nextIndex": {
      const newIndex = currentState.index + 1;
      const finished = newIndex == currentState.questions.length;
      return {
        ...currentState,
        answer: null,
        index: newIndex,
        status: finished ? "finished" : currentState.status,
        highscore: finished
          ? Math.max(currentState.highscore, currentState.score)
          : currentState.highscore,
      };
    }
    case "previousIndex":
      return { ...currentState, answer: null, index: currentState.index - 1 };
    case "newAnswer": {
      const question = currentState.questions.at(currentState.index);
      return {
        ...currentState,
        answer: action.payload,
        score:
          action.payload === question.correctOption
            ? currentState.score + question.points
            : currentState.score,
      };
    }
    case "restart":
      return {
        ...initialState,
        questions: currentState.questions,
        status: "ready",
      };
    case "tick": {
      const newTime = currentState.remainingSeconds - 1;
      const finished = newTime <= 0;
      return {
        ...currentState,
        remainingSeconds: newTime,
        status: finished ? "finished" : currentState.status,
        highscore: finished
          ? Math.max(currentState.highscore, currentState.score)
          : currentState.highscore,
      };
    }
    default:
      throw new Error("Action unkown");
  }
}

const QuizContext = createContext();

function QuizProvider({ children }) {
  const [
    { status, questions, index, answer, score, highscore, remainingSeconds },
    dispatch,
  ] = useReducer(reducer, initialState);

  // console.log(score)
  const maxPossiblePoints = questions.reduce(
    (acc, item) => acc + item.points,
    0
  );

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        dispatch,
        status,
        questions,
        index,
        answer,
        score,
        highscore,
        remainingSeconds,
        maxPossiblePoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context == undefined) throw new Error("Used out of QuizContext scope");
  return context;
}

export { QuizProvider, useQuiz };
