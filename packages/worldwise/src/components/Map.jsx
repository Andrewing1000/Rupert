import React, { useEffect, useRef, useState } from "react";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useGeolocationURLParams } from "../hooks/useGeolocationURLParams";

export default function Map() {
  // const [searchParams, setSearchParams] = useSearchParams(); //URL query
  const navigate = useNavigate(); // Programatic navigation
  const { currentCity, cities } = useCities();
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition} = useGeolocation();

  const [mapLat, mapLng] = useGeolocationURLParams();
  
  useEffect(
    function(){
      const {lat, lng} = geolocationPosition ?? {}
      if(lat && lng ) navigate(`form?lat=${lat}&lng=${lng}`); 
      //setMapPosition([lat, lng]) //Inconsisten way
    }
    , [geolocationPosition]
  )
  // const [mapPosition] = useState([mapLat, mapLng]);

  //SOLUTION ONE: RECALCULATES IN EVERY RENDER mapPosition
  //regarless of the state or prop that actually changed
  // const mapPosition = useRef([0, 40]);
  // mapPosition.current =
  // [mapLat?? mapPosition.current[0],
  //  mapLng?? mapPosition.current[1]]
  // console.log(mapPosition)

  //SOLUTION TWO: Link the recalculation to changes on
  //the mapLat and mapLng variables
  const [mapPosition, setMapPosition] = useState([0, 40]);

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );
  return (
    <div
      className={styles.mapContainer}
      // onClick={() => {
      //   // navigate("form");
      // }}
    >
      {
        (!geolocationPosition ||
          geolocationPosition.lat != mapPosition[0] ||
          geolocationPosition.lng != mapPosition[1]
        ) &&
        <Button
        type='position'
        onClick={getPosition}>
          {isLoadingPosition? "Loading..." : "Use your position"}
        </Button>
      }
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.name}</span>
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={mapPosition} />
        <DetectClick/>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap(); //Needs a leaflet map as a context provider
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => { //e is a leaflet wrapped event
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    }
  });
}

// <h1>
// Position &nbsp;
// {lat},{lng}
// </h1>
// <button
// onClick={(e) => {
//   //navigate("form")
//   //the navigate function internally uses
//   //the window.history api
//   setSearchParams({ lat: 1, lng: 2 });
//   e.stopPropagation()
//   // setSearchParams((prev) => ({
//   //     ...prev,
//   //     lat: 1,
//   //     lng: 2,
//   //   })); //lazy updating
//   //queueMicrotask(() => navigate("form"));
//   console.log("button listener");
// }}
// >
// Pruebita
// </button>
