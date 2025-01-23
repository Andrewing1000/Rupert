import React from "react";
import styles from "./CityItem.module.css";

import { Link } from "react-router-dom";
import { CitiesProvider, useCities } from "../contexts/CitiesContext";

const formatDate = (date) =>
  // eslint-disable-next-line no-undef
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

export default function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;


  return (
    <CitiesProvider>
      <li>
        <Link
          className={`${styles.cityItem} 
           ${currentCity.id == id ? styles["cityItem--active"] : ""}`}
          to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        >
          {/* The "to" prop is concatenated to the current url if no / is placed
        to indicate the root path */}
          <span className={styles.emoji}>{emoji}</span>
          <h3 className={styles.name}>{cityName}</h3>
          <time className={styles.date}>({formatDate(date)})</time>
          <button 
            onClick={(e)=>{
              e.preventDefault()
              deleteCity(id)}}
            className={styles.deleteBtn}>&times;</button>
        </Link>
      </li>
    </CitiesProvider>
  );
}
