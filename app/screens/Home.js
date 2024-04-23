import React, { useState } from 'react';
import { StyleSheet, View, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapComponent from '../Components/MapComponent';
import SearchBar from '../Components/SearchBar';
import ToggleSwitch from '../Components/ToggleSwitch';
import Styles from '../Components/Styles';
import { FIREBASE_AUTH } from '../config/Firebase.config'

const Home = ({ navigation }) => {
  const [destination, setDestination] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

  const handleSearch = async (query) => {
    // Your handleSearch logic here
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };


  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={Styles.container}>
        <View style={Styles.topBar}>
          <Button onPress={() => navigation.navigate('Details')} title='Abrir Detalhes'/>
          <Button title="Logout" onPress={() => handleLogout()} style={Styles.logoutButton} />
          <ToggleSwitch showMap={showMap} toggleMap={toggleMap} style={Styles.toggleSwitch} />
        </View>
        <View style={Styles.mapContainerScreen}>
          {showMap && <MapComponent destination={destination} portugalCenter={portugalCenter} />}
          {showMap && <SearchBar handleSearch={handleSearch} />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
