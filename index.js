import axios from 'axios';


import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
// import from 'react-leaflet';

// import { promiseToFlyTo, getCurrentLocation } from 'lib/map';



import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

// import gatsby_astronaut from 'assets/images/gatsby-astronaut.jpg';

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;
// const ZOOM = 10;

// const timeToZoom = 2000;
// const timeToOpenPopupAfterZoom = 4000;
// const timeToUpdatePopupAfterZoom = timeToOpenPopupAfterZoom + 3000;

// const popupContentHello = `<p>Hello 👋</p>`;
// const popupContentGatsby = `
//   <div class="popup-gatsby">
//     <div class="popup-gatsby-image">
//       <img class="gatsby-astronaut" src=${gatsby_astronaut} />
//     </div>
//     <div class="popup-gatsby-content">
//       <h1>Gatsby Leaflet Starter</h1>
//       <p>Welcome to your new Gatsby site. Now go build something great!</p>
//     </div>
//   </div>
// `;

const IndexPage = () => {

  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is and example of being used to zoom in and set a popup on load
   */

  async function mapEffect({ leafletElement:map} = {}) {


     let response;

    try {
      response = await axios.get('https://corona.lmao.ninja/countries');
    } catch(e) {
      console.log(`Failed to fetch countries: ${e.message}`, e);
      return;
    }

    const { data = [] } = response;

    const hasData = Array.isArray(data) && data.length > 0;

if ( !hasData ) return;

const geoJson = {
  type: 'FeatureCollection',
  features: data.map((country = {}) => {
    const { countryInfo = {} } = country;
    const { lat, long: lng } = countryInfo;
    return {
      type: 'Feature',
      properties: {
       ...country,
      },
      geometry: {
        type: 'Point',
        coordinates: [ lng, lat ]
      }
    }
  })
}


function countryPointToLayer (feature = {}, latlng){
   const { properties = {} } = feature;
    let updatedFormatted;
    let casesString;

    const {
      country,
      updated,
      cases,
      deaths,
      recovered
    } = properties

    casesString = `${cases}`;

    if ( cases > 1000 ) {
      casesString = `${casesString.slice(0, -3)}k+`
    }

    if ( updated ) {
      updatedFormatted = new Date(updated).toLocaleString();
    }

    const html = `
      <span class=“icon-marker”>
        <span class=“icon-marker-tooltip”>
          <h2>${country}</h2>
          <ul>
            <li><strong>Confirmed:</strong> ${cases}</li>
            <li><strong>Deaths:</strong> ${deaths}</li>
            <li><strong>Recovered:</strong> ${recovered}</li>
            <li><strong>Last Update:</strong> ${updatedFormatted}</li>
          </ul>
        </span>
        ${ casesString }
      </span>
      
    `;

    return L.marker( latlng, {
      icon: L.divIcon({
        className: 'icon',
        html
      }),
      riseOnHover: true
    });
  }

const geoJsonLayers = new L.GeoJSON(geoJson, {
  pointToLayer: countryPointToLayer
});

geoJsonLayers.addTo(map)



 
  }

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: 'OpenStreetMap',
    zoom: DEFAULT_ZOOM,
    mapEffect
  };

  return (
    <Layout pageName="home">
      <Helmet>
        <title>Home Page</title>
      </Helmet>

      <Map {... mapSettings} >
      </Map>

      <Container type="content" className="text-center home-start">
        <h2>EFFECT OF COVID-19 WORLDWIDE</h2>
        <p>The above shown countries have been affected by the Novel Corona Virus</p>
        <pre>
          <code>Hover Over the icons to see the confirmed cases, recovery and death poll.</code>
        </pre>
        <p className="note">"Let's practice social distancing to flatten the curve"</p>
      </Container>
    </Layout>
  );
};

export default IndexPage;
