import React from 'react';
import GoogleMapReact from 'google-map-react';

interface MapProps {
    latitude: number;
    longitude: number;
    text: string;
}

interface MarcadorProps {
    lat: number;
    lng: number;
    text: string; 
}

export const MapWithMarker: React.FC<MapProps> = ({ latitude, longitude }) => {
    return (
        <div style={{ height: '400px', width: '100%' }}>
             <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyB1H4k3zZQzphtFktHlSrdYucdSLkiG5AI' }}
        defaultCenter={{
          lat: latitude,
          lng: longitude
        }}
        defaultZoom={15}
      >
        <Marcador
          lat={latitude}
          lng={longitude}
          text="Marcador" // Adicionando o texto para o marcador
        />
      </GoogleMapReact>
        </div>
    );
};

const Marcador: React.FC<MarcadorProps> = ({ lat, lng }) => <div style={{
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'red',
    position: 'absolute',
    left: `${lat}px`,
    top: `${lng}px`,
}} />;

export default MapWithMarker;
