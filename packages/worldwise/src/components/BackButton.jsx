import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      type="back"
      onClick={(event) => {
        event.preventDefault();
        navigate(-1);
        event.stopPropagation();
      }}
    >
      &larr;Back
    </Button>
  );
}
