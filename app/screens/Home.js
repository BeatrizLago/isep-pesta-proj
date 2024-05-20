import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";
import MapComponent from "../Components/MapComponent";
import SearchBar from "../Components/SearchBar";
import Styles from "../Components/Styles";
import { fetchFromFirestore } from "../config/Firestore";
import ActivityLoader from "../Components/ActivityLoader";
import MyFilter from "../Components/MyFilter";

const Home = ({ navigation }) => {
  const [destination, setDestination] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const filters = ["0", "1", "2", "3", "4", "5"];
  const categories = useMemo(
    () => [...new Set(locations.map((item) => item.category))],
    [locations]
  );
  const cities = useMemo(
    () => [...new Set(locations.map((item) => item.address.city))],
    [locations]
  );

  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

  useEffect(() => {
    // Fetch locations from Firestore when component mounts
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const data = await fetchFromFirestore("locations");
      setLocations(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    // Your handleSearch logic here
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const clearFilters = () => {
    setSelectedFilters([]); // Clear selected filters
    setFilteredData(locations); // Reset filtered data to original data
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={Styles.container}>
        {loading ? (
          <ActivityLoader />
        ) : (
          <>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
              onPress={() => setShowFilter(!showFilter)} // Toggle filter visibility
            >
              <Text style={{ fontSize: 16, color: "blue" }}>
                {showFilter ? "Close Filter" : "Open Filter"}
              </Text>
            </TouchableOpacity>
            {showFilter && (
              <MyFilter
                data={locations}
                filters={filters}
                cities={cities}
                categories={categories}
                selectedFilters={selectedFilters}
                setFilteredData={setFilteredData}
                onFilterChange={setSelectedFilters}
              />
            )}

            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 190, zIndex: 1 }}
              onPress={clearFilters} // Call clearFilters function when pressed
            >
              <Text style={{ fontSize: 16, color: "red" }}>Clear Filters</Text>
            </TouchableOpacity>
            <View style={Styles.mapContainerScreen}>
              {showMap && (
                <MapComponent
                  destination={destination}
                  portugalCenter={portugalCenter}
                  locations={filteredData}
                />
              )}
              {showMap && <SearchBar handleSearch={handleSearch} />}
            </View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
