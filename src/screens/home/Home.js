import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import MapComponent from "../../components/map/MapComponent";
import { SearchBar } from "@rneui/themed";
import { Styles } from "./Home.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import MyFilter from "../../components/myfilter/MyFilter";
import { fetchDirections } from "../../state/actions/directionsAction";

const Home = ({ t }) => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location.locations);
  const directions = useSelector((state) => state.direction.directions);
  const error = useSelector((state) => state.direction.error);
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [destination, setDestination] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

  useEffect(() => {
    const test = async () => {
      const coordinates = [
        [-8.61489264, 41.14684],
        [-8.6138, 41.145951],
      ];
      await dispatch(fetchDirections(coordinates));
      console.log("Directions:", JSON.stringify(directions));
    };
    test();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchLocations());
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (locations.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [dispatch, locations.length]);

  useEffect(() => {
    if (locations.length > 0) {
      setFilteredData(locations);
    }
  }, [locations]);

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);

      if (query.trim() === "") {
        setDestination(null);
        setFilteredData(locations);
        return;
      }

      const searchResults = locations.filter(
        (location) =>
          location.name.toLowerCase().startsWith(query.toLowerCase()) ||
          location.address.street
            .toLowerCase()
            .startsWith(query.toLowerCase()) ||
          location.address.city.toLowerCase().startsWith(query.toLowerCase())
      );

      setFilteredData(searchResults);

      if (searchResults.length > 0) {
        setDestination({
          latitude: parseFloat(searchResults[0].coordinates.latitude),
          longitude: parseFloat(searchResults[0].coordinates.longitude),
          name: searchResults[0].name,
        });
      } else {
        setDestination(null);
      }
    },
    [locations]
  );

  const toggleMap = useCallback(() => {
    setShowMap((prevShowMap) => !prevShowMap);
  }, []);

  const toggleFilter = useCallback(() => {
    setShowFilter((prev) => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
    setFilteredData(locations); // Reset filtered data to original data
  }, [locations]);

  const closeModal = () => {
    setSelectedPlace(null); // Close modal when backdrop is pressed
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityLoader />
          ) : (
            <>
              <MyFilterButtons
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
                showFilter={showFilter}
                t={t}
              />
              <MyFilter
                showFilter={showFilter}
                data={locations}
                selectedFilters={selectedFilters}
                setFilteredData={setFilteredData}
                onFilterChange={setSelectedFilters}
                user={user}
                t={t}
              />
              {showMap && (
                <View style={Styles.mapContainerScreen}>
                  <SearchBar
                    placeholder={t("components.searchBar.text")}
                    onChangeText={handleSearch}
                    value={searchQuery}
                    round
                    lightTheme
                    platform="android"
                  />
                  <MapComponent
                    destination={destination}
                    directions={directions}
                    portugalCenter={portugalCenter}
                    locations={filteredData}
                    t={t}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Home;
