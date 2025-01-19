import React from "react";

export default function StartScreen({ numQuestions = 0, onDispatch }) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-iu"
        onClick={() => {
          onDispatch({ type: "start" });
        }}
      >
        Let&apos;s start
      </button>
    </div>
  );
}

// StartScreen.propTypes = {
//     numQuestions: PropTypes.string.isRequired,
//     onDispatch: PropTypes.function name(params) {

//     }
// }
