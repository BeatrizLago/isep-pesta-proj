import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { SearchBar, Overlay, Button } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import {
  clearDirections,
  fetchDirections,
} from "../../state/actions/directionsAction";
import MapComponent from "../../components/map/MapComponent";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import MyFilter from "../../components/myfilter/MyFilter";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { Styles } from "./Home.styles";
import Directions from "../../components/directions/Directions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLocations = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location.locations);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const toggleFilter = useCallback(() => {
    setShowFilter((prev) => !prev);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
    setFilteredData(locations);
  }, [locations]);

  return {
    locations,
    filteredData,
    setFilteredData,
    loading,
    toggleFilter,
    clearFilters,
    showFilter,
    setShowFilter,
    selectedFilters,
    setSelectedFilters,
  };
};

const useDirections = (startLocation, endLocation, profile) => {
  const dispatch = useDispatch();

  const handleDirections = useCallback(() => {
    if (startLocation && endLocation) {
      const coordinates = [startLocation, endLocation];
      const fetchAndLogDirections = async () => {
        const language = await AsyncStorage.getItem("LANGUAGE");
        const body = { coordinates, language };
        await dispatch(fetchDirections(body, profile));
        console.log("Directions:", JSON.stringify(body));
      };
      fetchAndLogDirections();
    } else {
      console.log("Please select both start and end locations.");
    }
  }, [startLocation, endLocation, dispatch]);

  const handleClearDirections = async () => {
    await dispatch(clearDirections());
  };

  return { handleDirections, handleClearDirections };
};

const Home = ({ t }) => {
  const {
    locations,
    filteredData,
    setFilteredData,
    loading,
    toggleFilter,
    clearFilters,
    showFilter,
    setShowFilter,
    selectedFilters,
    setSelectedFilters,
  } = useLocations();
  const user = useSelector((state) => state.user.userInfo);
  const [visible, setVisible] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { handleDirections, handleClearDirections } = useDirections(
    startLocation,
    endLocation,
    profile
  );
  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };
  const directions = useSelector((state) => state.direction.directions);

  const toggleOverlay = () => setVisible(!visible);

  const handleSelectLocation = useCallback(
    (locationName, setLocation) => {
      const selectedLocation = locations.find(
        (loc) => loc.name === locationName
      );
      if (selectedLocation) {
        setLocation([
          selectedLocation.coordinates.longitude,
          selectedLocation.coordinates.latitude,
        ]);
      }
    },
    [locations]
  );

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);

      if (query.trim() === "") {
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
    },
    [locations]
  );

  if (loading) {
    return <ActivityLoader />;
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1 }}>
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
          <View style={Styles.mapContainerScreen}>
            <SearchBar
              placeholder={t("components.searchBar.text")}
              onChangeText={handleSearch}
              value={searchQuery}
              round
              lightTheme
              platform="android"
            />
            <Button
              title="Get directions"
              onPress={toggleOverlay}
              buttonStyle={Styles.button}
            />
            <Button
              title="Clear directions"
              onPress={handleClearDirections}
              buttonStyle={Styles.button}
            />
            <Directions
              visible={visible}
              toggleOverlay={toggleOverlay}
              locations={locations}
              handleSelectLocation={handleSelectLocation}
              setStartLocation={setStartLocation}
              setEndLocation={setEndLocation}
              handleDirections={handleDirections}
              profile={profile}
              setProfile={setProfile}
            />
            <MapComponent
              destination={filteredData[0]}
              directions={directions}
              portugalCenter={portugalCenter}
              locations={filteredData}
              t={t}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Home;
