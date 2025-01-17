import {useState, useEffect} from 'react';

const APIKEY=  "740d6162"


export function useMovies(query, callback){
    const [loading, setLoading] = useState(false)
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("")
   
     //Effects are executed after browser paint phase
    useEffect(function() { //This will only be run on the mounting phase of the component
    // console.log("Effect exec", query)


    callback?.(null);
    if(query.length < 3){
        setMovies([])
        setError("")
        return
    }
    

    const controller = new AbortController();

    async function fetchMovies() {
        try{
        setError("");
        setLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`,
            {signal: controller.signal}
        );
        
        if(!res.ok) throw new Error("Something went wrong with fetching movies")
        const data = await res.json();
        if(data.Response === "False") throw new Error("Movie not found")
        //console.log(data.Search)
        setMovies(data.Search);
        setError("")
        } catch(err){
        if(err.name !== "AbortError") setError(err.message);
        console.log(err.message)
        } finally{
        setLoading(false);
        }
    }

    fetchMovies();

    return function () {
        controller.abort();
    }
    }, [query, /*callback*/]) //[] is the dependency array
    return {movies, loading, error}
}