import React from 'react';


function getWeatherIcon(wmoCode) {
    const icons = new Map([
      [[0], "☀️"],
      [[1], "🌤"],
      [[2], "⛅️"],
      [[3], "☁️"],
      [[45, 48], "🌫"],
      [[51, 56, 61, 66, 80], "🌦"],
      [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
      [[71, 73, 75, 77, 85, 86], "🌨"],
      [[95], "🌩"],
      [[96, 99], "⛈"],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return "NOT FOUND";
    return icons.get(arr);
  }


function convertToFlag(countryCode) {
const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
return new Intl.DateTimeFormat("en", {
    weekday: "short",
}).format(new Date(dateStr));
}

class Counter extends React.Component {
    
    constructor(props){
        super(props)
    }

    state = {
        loading: false,
        location: "", 
        displayLocation: "",
        weather: {}};

    setLocation = (e) => {
        this.setState({location: e.target.value})
    }
        
    fetchWeather = async () => {
            if(this.state.location.length < 2) return this.setState({weather: {}})

            this.setState({loading: true}) //Will just update the isLoading propety without afection the rest of the states
            //this does not happend with the useState hook as it would override the entire object
           
            try {
                // 1) Getting location (geocoding)
                const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
                );
                const geoData = await geoRes.json();
                // console.log(geoData);
                if (!geoData.results) throw new Error("Location not found");
                
                const { latitude, longitude, timezone, name, country_code } =
                geoData.results.at(0);
                const dateName = `${name} ${convertToFlag(country_code)}`;
                this.setState({
                    displayLocation: dateName
                });
                
                // 2) Getting actual weather
                const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
                );
                const weatherData = await weatherRes.json();
                console.log(weatherData.daily);
                this.setState({
                    weather: weatherData.daily
                })
            } catch (err) {
                console.log(err);
            } finally{
                this.setState({loading: false})
            }
        }

    componentDidMount(){ //For mounting phase
        this.fetchWeather()
        this.setState({
            location: localStorage.getItem("location") || ""
        })
    }

    componentDidUpdate(prevProps, prevState){ //For rerenders and not on mount
        if(this.state.location !== prevState.location){
            this.fetchWeather();
            localStorage.setItem('location', this.state.location)
        }
    }


   
    render(){ //Overrited React.Component.render and its equivalent to a functin component body
        const date = new Date('june 21 2027')
        date.setDate(date.getDate() + this.state.count); 
        
        return (<div className='app'>
            <h1>Classy Weather</h1>
            <Input
            onSetLocation={this.setLocation} //Child to parent comunication
            location={this.state.location}/>

            {/* <button onClick={this.fetchWeather}>
                Get Weather
            </button> */}
            {this.state.loading && <p>Loading...</p>}
            {this.state.weather.weathercode && 
                <Weather
                    weather={this.state.weather}
                    location={this.state.displayLocation}
                />
            }
            
        </div>)
    }
}


class Input extends React.Component{
    render(){
        return <input
        type="text" 
        placeholder='Search from location...'
        value={this.props.location}
        onChange={this.props.onSetLocation}>
        </input> 
    }
}

class Weather extends React.Component {
    //The constructor its not necessary if
    //the components its stateless or doesnt bind proper functions to this keyword
  
    componentWillUnmount(){ //Analogous to a cleanup functio   
        console.log("Weather is unmounting")
    }

    render(){
        const  {
            temperature_2m_max: max,
            temperature_2m_min: min, 
            time: dates,
            weathercode: codes, 
        } = this.props.weather;

        return <div>
            <h2>Weather {this.props.location}</h2>
            <ul className="weather">
                {dates.map((date, index) => {
                    return <Day 
                    day={date}
                    max={max.at(index)}
                    min={min.at(index)}
                    code={codes.at(index)}
                    key={date}
                    isToday={index===0}
                    />
                })}
            </ul>
        </div>
    }
}

class Day extends React.Component {
    render(){
        const { day, max, min, code, isToday } = this.props
        return <li className="day">
            <span>{getWeatherIcon(code)}</span>
            <p>{isToday? "Today": formatDay(day)}</p>
            <p>
                {Math.floor(min)}&deg; &mdash; {Math.ceil(max)}&deg;
            </p>
        </li>
    }
}

export default Counter;


//Take out:
//useEffect joints together all the functionality of
//class based component lifecycle methods in one place
