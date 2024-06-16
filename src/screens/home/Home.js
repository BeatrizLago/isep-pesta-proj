import React, { useState, useEffect, useCallback } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import MapComponent from "../../components/map/MapComponent";
import SearchBar from "../../components/searchbar/SearchBar";
import { Styles } from "./Home.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
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
  const [destination, setDestination] = useState(null);

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

  const handleSearch = useCallback(
    (query) => {
      if (query.trim() === "") {
        setDestination(null);
        setFilteredData(locations); // Reset to all locations if search query is empty
        return;
      }
  
      const searchResult = locations.find(
        (location) =>
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.address.street.toLowerCase().includes(query.toLowerCase()) ||
          location.address.city.toLowerCase().includes(query.toLowerCase())
      );
  
      if (searchResult) {
        setDestination({
          latitude: parseFloat(searchResult.coordinates.latitude),
          longitude: parseFloat(searchResult.coordinates.longitude),
          name: searchResult.name, // Add the name here
        });
        setFilteredData([searchResult]);
      } else {
        setDestination(null);
        setFilteredData([]); // Reset to all locations if no match found
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

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={Styles.container}>
        {loading ? (
          <ActivityLoader />
        ) : (
          <>
            <MyFilterButtons
              toggleFilter={toggleFilter}
              clearFilters={clearFilters}
              showFilter={showFilter}
            />
            <MyFilter
              showFilter={showFilter}
              data={locations}
              selectedFilters={selectedFilters}
              setFilteredData={setFilteredData}
              onFilterChange={setSelectedFilters}
              user={user}
            />
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
