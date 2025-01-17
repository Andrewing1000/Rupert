import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'

import StarRating from './StarRating';
import {useState} from 'react';
import PropTypes from "prop-types";


function Test(){

  const [movieRating, setMovieRating] = useState(0); 
  return <div>
    <div>Highjackeado: {movieRating}</div>
    <StarRating 
      maxRating={5}
      className='pepa'
      messages={["Coco", "Queso", "Hiervita", "A", "B"]}
      defaultRating={3}
      onSetRating={setMovieRating}/>
  </div>
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating />
    <StarRating color='red' size={3}/>
    <Test/> */}
  </React.StrictMode>
);
