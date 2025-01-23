import React, { useEffect, useReducer } from "react";
import Error from "./Error";
import Header from "./Header";
import Loader from "./Loader";
import Main from "./Main";
import Question from "./Question";
import StartScreen from "./StartScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishedScreen";
import Timer from "./Timer";
import { useQuiz } from "../contexts/QuizContext";

export default function App() {
  const {status} = useQuiz();

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen/>
        )}
        {status === "active" && (
          <>
            <Progress/>
            <Question/>
            <footer>
              <Timer/>
              <NextButton/>
            </footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen/>
        )}
      </Main>
      {/* <DateCounter></DateCounter> */}
    </div>
  );
}
