import React, {createContext, useContext} from "react";
import {useJsApiLoader} from "@react-google-maps/api";

const libraries = ["places"];
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({children}) => {
  const {isLoaded} = useJsApiLoader({
    id: "tabibook-google-maps-api",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  return <GoogleMapsContext.Provider value={{isLoaded}}>{children}</GoogleMapsContext.Provider>;
};

export const useGoogleMapContext = () => {
  return useContext(GoogleMapsContext);
};
