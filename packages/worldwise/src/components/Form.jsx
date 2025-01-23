// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import React, { useState, useEffect } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackButton from "./BackButton";
import Message from "./Message";
import { useGeolocationURLParams } from "../hooks/useGeolocationURLParams";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";


export function convertToEmoji(countryCode) {
  // console.log(countryCode)
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");

  // const navigate = useNavigate();
  const [mapLat, mapLng] = useGeolocationURLParams();
  const [isLoadingGeocoding, setIsloadingGeocoding] = useState(false);
  const [error, setError] = useState("");
  const {createCity, isLoading} = useCities();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!mapLat || !mapLng) return;

      async function fetchCity() {
        setError("");
        try {
          setIsloadingGeocoding(true);
          const res = await fetch(
            `${BASE_URL}?latitude=${mapLat}&longitude=${mapLng}`
          );
          const data = await res.json();

          if (data.countryCode === "" && data.city === "")
            throw new Error("Not a valid location");
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          // alert("Error loding the data", err)
          setError(err.message);
        } finally {
          setIsloadingGeocoding(false);
        }
      }

      fetchCity();
    },
    [mapLat, mapLng]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if(!cityName || !date) return;
    const newCity = {
      cityName, 
      country,
      emoji,
      date,
      notes,
      position: {lat: mapLat, lng:  mapLng},
    }

    await createCity(newCity);
    navigate("/app/cities")
  }


  if (error) return <Message message={error} />;
  if (!mapLat || !mapLng)
    return <Message message={"Start by clicking a location"} />;
  if (isLoadingGeocoding) return <Spinner />;
  return (
    <form
    onSubmit={handleSubmit}
    className={styles.form.concat(`${isLoading? styles.loading : ""}`)}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* htmlFor is the "for" label atribute
        that its used to focus into the element whose id 
        matches this atribute value upon a click on the label element*/}
        <DatePicker 
        id="date"
        onChange={(date) => setDate(date)}
        selected={date}
        dateFormat={"dd/MM/yyyy"}
        />        
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"} onClick={() => {}}>
          Add
        </Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
