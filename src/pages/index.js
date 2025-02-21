import { useEffect, useState, useRef } from "react";
import { FiWind } from "react-icons/fi";
import { BsWater } from "react-icons/bs";
import Image from 'next/image';
import githubIcon from "../../public/github-icon.svg";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const inputRef = useRef(null);
  const [cityName, setCityName] = useState("");
  const [isLatitude, setLatitude] = useState(null);
  const [isLongitude, setLongitude] = useState(null);
  const [weatherObject, setWeatherObject] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((posistion) => {
      setLatitude(posistion.coords.latitude);
      setLongitude(posistion.coords.longitude);
    });
    userRenderWeather();
    inputRef.current.focus()
  }, [])

  const data = new Date();
  const formattedDate = data.toLocaleDateString('en-US', {
    weekday: 'long', // Full weekday name (e.g., Sunday)
    day: 'numeric',   // Day of the month (e.g., 22)
    month: 'long',  // Full month name (e.g., November)
    year: 'numeric'  // Four-digit year (e.g., 2025)
  });



  const userRenderWeather = async () => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${isLatitude}&lon=${isLongitude}&appid=${apiKey}`;
      const response = await fetch(url);
      const res = await response.json()
    } catch (error) {
      setError(error.message);
    }
  }

  const handlerWeatherSearch = (event) => {
    setCityName(event.target.value);
  }

  const handleSubmit = () => {
    apiFetch(cityName);
    setCityName("");
  }

  const apiFetch = async (cityName) => {
    try {
      const searchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName || "Hyderabad"}&appid=${apiKey}`;
      const response = await fetch(searchUrl);
      const endResponse = await response.json();
      setWeatherObject(endResponse);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <main className="text-center mt-8 text-white ">
      <header>
        <a href="https://github.com/Nandakishore695/nextJs-weather-application"><Image src={githubIcon} alt="gitHub Nandakishore695" width={70} className="float-right"/></a>
      </header>
      <h1 className="capitalize text-6xl mt-12 text-white drop-shadow-xl">weather app</h1>
      <div className="m-8">
        <div className="flex justify-center m-8 items-center">
          <input className="text-4xl rounded mx-2 p-1 text-black" type="search" autoComplete="off" placeholder="Search City Name..." name="cityName" onChange={handlerWeatherSearch} ref={inputRef} />
          <button className="text-2xl mx-2 bg-green-500 p-2 rounded" onClick={handleSubmit}>Get Temperature</button>
        </div>
      </div>
      <div>
      </div>

      {weatherObject ?
        <div>
          <div className="mb-10">
            <h2 className="text-4xl ">{weatherObject.name} , {weatherObject.sys?.country}</h2>
            <p>{formattedDate}</p>
          </div>
          <h3 className="text-6xl font-bold">{weatherObject.wind?.deg}<sup>o</sup> cel</h3>
          <div className="flex justify-center m-4">
            <div className="flex mx-4 items-center">
              <BsWater size={30} />
              <p className="">{weatherObject.main?.humidity + "%"} </p>
            </div>
            <div className="flex items-center">
              <FiWind size={30} />
              <p className="">
                {weatherObject.wind?.speed + "km/h"}  </p>
            </div>
          </div>
          <p className="italic font-bold">{weatherObject.weather?.[0].description} </p>
        </div> :
        <p>{error}</p>}
    </main>
  );
}
