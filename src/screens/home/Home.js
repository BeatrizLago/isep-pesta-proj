import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MapComponent from "../../components/map/MapComponent";
import SearchBar from "../../components/searchbar/SearchBar";
import { Styles } from "./Home.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location.locations);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [showMap, setShowMap] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

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

  const handleSearch = useCallback(async (query) => {
    // Your handleSearch logic here
  }, []);

  const toggleMap = useCallback(() => {
    setShowMap((prevShowMap) => !prevShowMap);
  }, []);

  const clearFilters = useCallback(() => {
    setFilteredData(locations); // Reset filtered data to original data
  }, [locations]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={Styles.container}>
        <MyFilterButtons
          toggleFilter={() => setShowFilter((prev) => !prev)}
          clearFilters={clearFilters}
          showFilter={showFilter}
        />
        <SearchBar handleSearch={handleSearch} />
        <View style={Styles.mapContainerScreen}>
          {loading ? (
            <ActivityLoader />
          ) : (
            showMap && (
              <MapComponent
                destination={null}
                portugalCenter={portugalCenter}
                locations={filteredData}
              />
            )
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
