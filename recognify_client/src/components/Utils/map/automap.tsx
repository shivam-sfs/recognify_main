import React, {useState} from 'react';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import LocationSearchInput from './autoPlaceComplate';
import Accordion from 'react-bootstrap/Accordion';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  setCoordinates: React.Dispatch<Coordinates>,
  Coordinates: Coordinates
}

const MapComponent: React.FC<MapComponentProps> = ({setCoordinates, Coordinates}) => {

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    setCoordinates({lat: lat || 0, lng: lng || 0});

  };

  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string,
  });

  const mapOptions: google.maps.MapOptions = {
    // disableDefaultUI: true,
    zoomControl: true,
  };

  const handleLocationSelect = (latLng: Coordinates) => {
    setCoordinates(latLng)
    console.log(latLng)
  };

  return isLoaded ? (
    <Accordion defaultActiveKey="1">
      <Accordion.Item eventKey="0">
        <Accordion.Header>map</Accordion.Header>
        <Accordion.Body>
          <div className='mt-2'>
            <div className='mt-2 mb-2'>
              <label htmlFor="" className='className="form-control-label"'>Search you location</label>
              <LocationSearchInput onSelect={handleLocationSelect} />
            </div>
            <div style={{height: '300px', width: '100%'}}>
              <GoogleMap
                mapContainerStyle={{height: '100%', width: '100%'}}
                center={{lat: Coordinates?.lat || 22, lng: Coordinates?.lng || 78}}
                zoom={Coordinates ? 13 : 2}
                options={mapOptions}
                onClick={handleMapClick}
              >
                {Coordinates && (
                  <Marker
                    position={Coordinates}
                  />
                )}
              </GoogleMap>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  ) : null;
};

export default MapComponent;
