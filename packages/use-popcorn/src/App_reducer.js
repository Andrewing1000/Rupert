import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0).toFixed(2);


const APIKEY=  "740d6162"

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [selectedId, setSelectedId] = useState(null);
  const {movies, error, loading} = useMovies(query, handleClose)
  //console.log (query)

  //Effects are executed after browser paint phase
  //[] excuted upon mount render
  //<empty>/undefined executed upon every render
  //[a, ...] executed upen a state change of a

  //Component lifecycle:
  //Mount--> Adder to the fiver tree
  //Rerender
  //Removed


  //Effect main goal is not running code at a certain part of the LC
  //Instead their are meant to keep sync with external dependencies

  //Effects have three parts
  //Effect code
  //Dependency array
  //Cleanup function as their return value
  
  //!!!DO NOT OVERUSE IT, it does not replace event handlers
  function handleClose(){
    setSelectedId(null)
  }

  function setMovieClose(){
    setSelectedId(null);
  }

  function handleAddMovie(movie){
    const included = watched.some(item => item.imdbID===movie.imdbID)
    if(!included){
      setWatched([...watched, movie])
      // localStorage.setItem('watched', JSON.stringify([...watched, movie])) //Persistency option 1
    } 
  }
  //Another effect with [] as its depedency array could be used to load watched upon initialization
  //But we are going to use a baseState with a callback: useState(function() {const storedValue = localStorage.getItem('watched')})

  function handleDelete(id){
    setWatched(watched.filter(item => item.imdbID!==id))
  }

  return (
    <>
      <Navbar>    
        <Search
          query={query}                   //Component composition to avoid prop drilling
          setQuery={setQuery}/>
        <Results
          movies={movies}/>
      </Navbar>
      
      <Main>

         
        <Panel>
          {/* {loading?
          <Loader/> :
          <MovieList movies={movies}/>
          } */}

          {loading && <Loader/>}
          {!loading && !error &&
             <MovieList movies={movies}
            setSelectedId={setSelectedId}
            />}
          {error && <ErrorMessage message={error}/>}
        </Panel>
        

        {/* <Panel element={<MovieList movies={movies}/>}>
          <MovieList movies={movies}/>
        </Panel> //PASSING CHILDREN AS EXPLICIT PROPS */}  

        <Panel>
          {selectedId!==null?
            <MovieDetail
            onClose={setMovieClose}
            movie={movies.find((movie) => movie.imdbID===selectedId)}
            watchedObj={watched.find(movie => movie.imdbID ===selectedId)}
            onAddWatched={(movie)=>{handleAddMovie(movie)}}
            />:
            <>
            <WatchedSummary watched={watched}/>
            <WatchedList watched = {watched} onDelete = {handleDelete}/>
            </>
          }
        </Panel>
      </Main>
    </>
  );
}

//Three categories of components: Stateless/Presentational Stateful Structural
//Staless presents states that come exclusively from props
//Structural are usuarlly now reusable buts its better when they are
//Structural define the page layout or large layouts in general
//Navbar: Structural
//Logo: Presentational
//Search: Stateful
//Results: Presentational

function Loader(){
  return <p className="loader">Loading...</p>
}

function ErrorMessage({message}){
  return <p className="error">{message}</p>
}

function Main({children}){
  return  <main className="main">
    {children}
  </main>
}

function WatchedSummary({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
}

function WatchedList({watched, onDelete}){
  return <ul className="list">
          {watched.map((movie) =>
             (<WatchedMovie
              movie={movie}
              onDelete={onDelete}
              key={movie.imdbID}/>))}
        </ul>
}

function WatchedMovie({movie, onDelete}){
  return <li key={movie.imdbID}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.runtime} min</span>
      </p>

      <button  className='btn-delete'
      onClick={() => onDelete(movie.imdbID)}>X</button>
    </div>
  </li>
}


function Panel({element, children}){
  const [isOpen2, setIsOpen2] = useState(true);
  
  return <div className="box">
    <ToggleButton isOpen1={isOpen2} setIsOpen1={setIsOpen2}/>
    {isOpen2 && children}
  </div>;
}

function MovieList({movies, setSelectedId, setOnClose}) {
  return <ul className="list">
        {movies?.map((movie) => 
          <MovieCard
            movie={movie}
            onSelected={()=>setSelectedId(movie.imdbID)}
            onClose={setOnClose}
            key={movie.imdbID}/>)}
      </ul>
}

function ToggleButton({setIsOpen1, isOpen1}){
  return <button
    className="btn-toggle"
    onClick={() => setIsOpen1((open) => !open)}
  >
  {isOpen1 ? "–" : "+"}
  </button>
}

function MovieCard({movie, onSelected}){
  return <li key={movie.imdbID} onClick={onSelected}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>
}

function MovieDetail({movie, onClose, onAddWatched, watchedObj}){
  const [movieDetails, setMovieDetails] = useState(null) 
  const [userRating, setUserRating] = useState(null)
  const [isLoading, setIsLoading] = useState(false);
  const countRef = useRef(0)
  //if(<condition>) const [a, setA] =useState(<newValue>)
  //wont work because the default value is only loading in the
  //mounting phase


  //setState2(newState2)
  //setState2(f(state2)) // will update based on oldState1
  //since set states are dont async and state1 is a reference to the old value

  //setState2(newState2)
  //setState2((x) => f(x)) // will update with newState2
  //as async calls are executed in the same order as they were declared



/* eslint-disable */         //Use this to disable the linting/
  // this leads to errors if(false) useState(1)

  
  useKey("Escape", onClose)
    
  useEffect(
    function(){
      if(userRating) countRef.current += 1
    }
    , [userRating])

  useEffect(
    function(){
      if(!(movieDetails?.Title)) return;
      document.title = movieDetails.Title
      return () => {document.title = "usePopcorn"} // cleanup function
    }
    , [movieDetails])
      
      //JS closure: Variables declared in a function are remembered in its execution
      //even if the component they belog to is destroyed beforehand
      
    function handleAdd(){
      const newMovie = {
        ...movieDetails,
        imdbRating: Number(movieDetails.imdbRating),
        runtime: movieDetails.Runtime?.split(" ").at(0),
        userRating,
        conutRating: countRef.current,
      }
      onAddWatched(newMovie)
      onClose()    
    }

  //Mount
  //Commit
  //Layout Effect
  //Browser Paint
  //Cleantup
  //Effect
  //Unmount 
  //Cleanup

  //Clean is before the effect is executed again
  //and after the component unmounts
  
  //Http request -> Cancel request
  //Start timer -> Cancel timer
  //Add event listener -> remove event listener
  
  

  useEffect(function() {
    async function getMovieDetails() {
      setIsLoading(true);    
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${APIKEY}&i=${movie.imdbID}`);
      const data = await res.json();
      setIsLoading(false);
      setMovieDetails(data);
    }

    getMovieDetails()
  }, [movie])

  return <div className="details">
    {isLoading?
    <Loader/>:
    <>
      <header>
        <button className="btn-back" onClick={onClose}>
        &larr;
        </button>
        <img src={movieDetails?.Poster} alt={`Poster of ${movie.imdbID}`}/>
        <div className="details-overview">
          <h2>{movieDetails?.Title}</h2>
          <p>{movieDetails?.Released}</p>
          <p>{movieDetails?.Genre}</p>
          <p>{movieDetails?.imdbRating} IMDb Rating</p>
        </div>
      </header>
      

      <section>
        <div className='rating'>
          <StarRating 
          defaultRating={watchedObj?.userRating ?? 0}
          onSetRating={setUserRating}
          size={2.3}
          maxRating={10}/>

          <button className="btn-add" onClick={handleAdd}>
            {!watchedObj && "+ Add to list"}
            {watchedObj && watchedObj.userRating!==userRating && "Edit rating"}
          </button>
        </div>
        <p><em>{movieDetails?.Plot}</em></p>
        <p>Starring {movieDetails?.Actors}</p>
        <p>Directed by {movieDetails?.Airector}</p>
      </section>
    </>
    }
  </div>
}

function Navbar({children}) {
  return <nav className="nav-bar">
    <Logo/>
    {children}
  </nav>;
}

function Logo(){
  return <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
}

function Results({movies}){
  return <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>
}

function Search({query, setQuery}){

  // useEffect(function(){ 
  //   const element = document.querySelector(".search") //Against the react pardigm
  //   element.focus() //Flimsy implementation, suseptible to bugs
  // }, [])

  const inputElement = useRef(null)

  useKey("Enter", () => {setQuery(""), inputElement.current.focus()})  
  //useRef == useState but does not trigger rerenders when its updated
  //useRef is mutable
  //useRef updates are synchronous

  return <input
  className="search"
  type="text"
  placeholder="Search movies..."
  value={query}
  ref={inputElement}
  onChange={(e) => {
    setQuery(e.target.value);}
  } />
}


//Two thing can be reused in React
//UI and LOGIC

//For UI --> Components
//For LOGIC --> REGULAR FUNCTIONS, CUSTOM HOOK
//CUSOM HOOK when the logic involves react hooks
//One custom hook should only have one prupose
//React hook rules apply for custom hooks as well



