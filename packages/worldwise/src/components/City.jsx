import React, {useState, useEffect} from 'react';
import styles from "./City.module.css";

import { useParams, useSearchParams} from 'react-router-dom';
import { CitiesProvider, useCities } from '../contexts/CitiesContext';

import Button from './Button';
import Spinner from './Spinner';
import BackButton from './BackButton';

const formatDate = (date) =>
  // eslint-disable-next-line no-undef
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  // TEMP DATA

  const params = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();

  // //console.log(params) //Path parameters
  // const lat = searchParams.get('lat');  
  // const lng = searchParams.get('lng');  

//  const [currentCity, setCurrentCity] = useState({});

  const {currentCity, getCity, isLoading} = useCities();
  
  
  useEffect(function(){
    getCity(params.id)
  }, [params, getCity]) //Remember to come back to this and address the missing getCity dependency
  //(has to do with an infinite loop)
//try to be carefull with the selection of dependencies
//object reference change in every rerender if they are rebuilt
//and useEffect uses === to check changes in the dependencies


//Another good practice is to remove the number of required 
//dependencies:

//1. Including function in the declaration of the useEffect
//2. Using useCallback
//3. Moving the function outside of the component if possible
//4. including granular dependecies, e.g. Members of an object, even better if they are primitives
//5. Using useMemo for objects
//6. Group many state dependencies in a single Reducer
//7. exlude dispatch and setState from the dependencies, react quaranties they are stable across renders

//MINIMIZE THE USE OF EFFECTS: "LAST RESORT"

//NOT USE CASES:
//-USER EVENTS: USE EVENT HANDLERS 
//-API REQUESTS: USE SPECIALIZED LIBRARIES e.g. React Query
//-SYNCRONIZED EVETS: USE REDUCER OR DERIVED STATE
  
  // console.log(getCity, currentCity, params.id)
  const { lat, lng, id, cityName, emoji, date, notes } = currentCity;
  
  if(isLoading) return <Spinner/>
  return (
    <CitiesProvider>
      <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
       <BackButton/>
      </div>
    </div>
    </CitiesProvider>
   );
}

export default City;
