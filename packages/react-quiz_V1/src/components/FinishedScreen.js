import { useQuiz } from "../contexts/QuizContext";
import React from "react";

export default function FinishScreen(){
    const {score: points, maxPossiblePoints, highscore, dispatch} = useQuiz();
    const percentage = points/maxPossiblePoints*100

    return <>
    <p className="result">
        You scored <strong>{points}</strong> out of 
        &nbsp;{maxPossiblePoints} ({Math.ceil(percentage)}%)
    </p>

    <p className="highscore">(Highscore: {highscore} points)</p>
    
    <button className="btn btn-ui"
    onClick={() => dispatch({type: "restart"})}>
        Restart</button>
    </>
}