import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";
import MapComponent from "../../components/map/MapComponent";
import SearchBar from "../../components/searchbar/SearchBar";
import { Styles } from "./Home.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilter from "../../components/myfilter/MyFilter";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location.locations);
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
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
    setSelectedFilters([]);
    setFilteredData(locations); // Reset filtered data to original data
  }, [locations]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={Styles.container}>
        {loading ? (
          <ActivityLoader />
        ) : (
          <>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
              onPress={() => setShowFilter((prevShowFilter) => !prevShowFilter)}
            >
              <Text style={{ fontSize: 16, color: "blue" }}>
                {showFilter ? "Close Filter" : "Open Filter"}
              </Text>
            </TouchableOpacity>
            {showFilter && (
              <MyFilter
                data={locations}
                selectedFilters={selectedFilters}
                setFilteredData={setFilteredData}
                onFilterChange={setSelectedFilters}
                user={user}
              />
            )}

            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 190, zIndex: 1 }}
              onPress={clearFilters}
            >
              <Text style={{ fontSize: 16, color: "red" }}>Clear Filters</Text>
            </TouchableOpacity>
            <View style={Styles.mapContainerScreen}>
              {showMap && (
                <MapComponent
                  destination={null}
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
