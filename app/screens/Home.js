import React, { useState } from 'react';
import { StyleSheet, View, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapComponent from '../Components/MapComponent';
import SearchBar from '../Components/SearchBar';
import ToggleSwitch from '../Components/ToggleSwitch';
import { FIREBASE_AUTH } from '../../Firebase.config';

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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Button onPress={() => navigation.navigate('Details')} title='Abrir Detalhes'/>
          <Button title="Logout" onPress={() => FIREBASE_AUTH.signOut()} style={styles.logoutButton} />
          <ToggleSwitch showMap={showMap} toggleMap={toggleMap} style={styles.toggleSwitch} />
        </View>
        <View style={styles.mapContainer}>
          {showMap && <MapComponent destination={destination} portugalCenter={portugalCenter} />}
          {showMap && <SearchBar handleSearch={handleSearch} />}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  logoutButton: {
    marginRight: 20,  
  },
  toggleSwitch: {
    marginLeft: 20,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20, // Adjust this value to move the search bar higher
  },
});

export default Home;
