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
import { fetchDirections } from "../../state/actions/directionsAction";
import AutoComplete from "../../components/autoCompleteInput/AutoComplete";
import MapComponent from "../../components/map/MapComponent";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import MyFilter from "../../components/myfilter/MyFilter";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { Styles } from "./Home.styles";

const useLocations = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location.locations);
  const [filteredData, setFilteredData] = useState([]);
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

  return { locations, filteredData, setFilteredData, loading };
};

const useDirections = (startLocation, endLocation) => {
  const dispatch = useDispatch();

  const handleDirections = useCallback(() => {
    if (startLocation && endLocation) {
      const coordinates = [startLocation, endLocation];
      const fetchAndLogDirections = async () => {
        await dispatch(fetchDirections(coordinates));
        console.log("Directions:", JSON.stringify(coordinates));
      };
      fetchAndLogDirections();
    } else {
      console.log("Please select both start and end locations.");
    }
  }, [startLocation, endLocation, dispatch]);

  return { handleDirections };
};

const Home = ({ t }) => {
  const { locations, filteredData, setFilteredData, loading } = useLocations();
  const [visible, setVisible] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { handleDirections } = useDirections(startLocation, endLocation);
  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

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
            toggleFilter={() => setShowFilter((prev) => !prev)}
            clearFilters={() => setFilteredData(locations)}
            t={t}
          />
          <MyFilter data={locations} setFilteredData={setFilteredData} t={t} />
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
              title="Open Overlay"
              onPress={toggleOverlay}
              buttonStyle={Styles.button}
            />
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
              <AutoComplete
                data={locations}
                placeholder="Enter start location"
                onSelect={(name) =>
                  handleSelectLocation(name, setStartLocation)
                }
              />
              <AutoComplete
                data={locations}
                placeholder="Enter destination"
                onSelect={(name) => handleSelectLocation(name, setEndLocation)}
              />
              <Button
                title="Give directions"
                onPress={() => {
                  toggleOverlay();
                  handleDirections();
                }}
              />
            </Overlay>
            <MapComponent
              destination={filteredData[0]}
              directions={useSelector((state) => state.direction.directions)}
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
