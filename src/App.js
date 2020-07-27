import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";


function App() {

  const [countries, setcountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState({ lat: 34.80746,     lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  const [mapCountries, setMapCountries] = useState([]);

  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, []);

  useEffect(() => {
    //async -> send a request , wait for it, do something with data
    const getCountriesData = async () => {
       await fetch ("https://disease.sh/v3/covid-19/countries")
       .then((response) => response.json())
       .then ((data) => {
         const countries = data.map((country) => (
           {
             name: country.country,
             value: country.countryInfo.iso2
           }
         ));
       

       const sortedData = sortData(data);  
       setTableData(sortedData);
       setcountries(countries);

       setMapCountries(data);

       });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url).then(response => response.json())
      .then(data => {

        setCountry(countryCode);
        setCountryInfo(data); //all data of the country

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4.5);

      });

  };


  return (
    <div className="app">
      
      
        <div className="app__left">
            {/* Header */}{/* title + select dropdown */}
            <div className="app__header">
              <h1 className="app__title">COVID-19 TRACKER</h1>
              <h4 className="app__developer">&copy; Developed by Istiak Jaman</h4>
              <FormControl className="app__dropdown">
                <Select variant="outlined" onChange={onCountryChange} value={country}>
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {
                    countries.map(country => (
                      <MenuItem value={country.value} >{country.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </div>

            <div className="app__stats">
              {/* InfoBoxs */}
              <InfoBox isRead active={casesType === "cases"} onClick={e => setCasesType('cases')} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={ prettyPrintStat(countryInfo.cases)} />
              {/* InfoBoxs */}
              <InfoBox active={casesType === "recovered"} onClick={e => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
              {/* InfoBoxs */}
              <InfoBox isRead active={casesType === "deaths"} onClick={e => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
            </div>

            {/* Maps */}
            <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}  />  
          
        </div>

        <Card className="app__right">  
          <CardContent>

            {/* Tables */}
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            {/* <br></br> */}
            {/* Graph */}
            <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />

          </CardContent>
        </Card>


    


    </div>
  );
}

export default App;
