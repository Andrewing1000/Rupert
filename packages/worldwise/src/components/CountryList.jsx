import React from 'react';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCities } from '../contexts/CitiesContext';

export default function CountriesList(){
    const {cities, isLoading} = useCities();
    
    if(isLoading) return <Spinner/>;

    if(!cities.length) return <Message message="Add you first city by clicking on the map"/>
    
    const included = new Set()
    const countries = cities.filter((city) => {
        if(included.has(city.country)) return false
        included.add(city.country)
        return true
    })
    return <ul className={styles.countryList}>
            {
                countries.map((country) =>
                    <CountryItem country={country} key={country.id}/>)
            }
        </ul> 
}