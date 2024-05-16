import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapComponent from "../Components/MapComponent";
import SearchBar from "../Components/SearchBar";
import Styles from "../Components/Styles";
import { fetchFromFirestore } from "../config/Firestore"; 

const Home = ({ navigation }) => {
  const [destination, setDestination] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [locations, setLocations] = useState([]);

  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

  useEffect(() => {
    // Fetch locations from Firestore when component mounts
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const data = await fetchFromFirestore("locations");
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSearch = async (query) => {
    // Your handleSearch logic here
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={Styles.container}>
        <View style={Styles.mapContainerScreen}>
          {showMap && (
            <MapComponent
              destination={destination}
              portugalCenter={portugalCenter}
              locations={locations}
            />
          )}
          {showMap && <SearchBar handleSearch={handleSearch} />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
