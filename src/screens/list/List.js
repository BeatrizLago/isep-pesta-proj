import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import PlaceCard from "../../components/placecard/PlaceCard";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilter from "../../components/myfilter/MyFilter";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import { Styles } from "./List.styles";
import axios from "axios";
import * as Location from "expo-location";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

const List = ({ t }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);

  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchPointsOfInterest(userLocation);
    }
  }, [userLocation]);

  const fetchPointsOfInterest = async (location) => {
    const url = `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${location.longitude},${location.latitude},100000&limit=100&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await axios.get(url);
      const pois = response.data.features.map((poi) => ({
        id: poi.properties.place_id.toString(),
        name: poi.properties.name || "Tourist Point",
        coordinates: {
          latitude: poi.geometry.coordinates[1],
          longitude: poi.geometry.coordinates[0]
        },
        address: {
          street: poi.properties.street || "Unknown",
          city: poi.properties.city || "Unknown"
        },
        category: poi.properties.categories || "Tourism"
      }));
      setPointsOfInterest(pois);
      setFilteredData(pois);
    } catch (error) {
      console.error("Error fetching POIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (userLocation) {
      await fetchPointsOfInterest(userLocation);
    }
    setRefreshing(false);
  }, [userLocation]);

  const toggleFilter = useCallback(() => {
    setShowFilter((prev) => !prev);
  }, []);

  return (
      <View style={{ flex: 1 }}>
        {loading ? (
            <ActivityLoader />
        ) : (
            <>
              <MyFilterButtons
                  toggleFilter={toggleFilter}
                  showFilter={showFilter}
                  t={t}
              />
              <MyFilter
                  showFilter={showFilter}
                  data={pointsOfInterest}
                  selectedFilters={[]}
                  setFilteredData={setFilteredData}
                  onFilterChange={() => {}}
                  user={user}
                  t={t}
              />
              {filteredData.length > 0 ? (
                  <FlatList
                      data={filteredData}
                      renderItem={({ item }) => (
                          <PlaceCard
                              place={{
                                id: item.id,
                                name: item.name,
                                address: item.address,
                                category: item.category,
                                coordinates: item.coordinates,
                                accessibility: {},
                                wheelchair: { width: null, height: null },
                                phoneNumber: null,
                                email: null,
                                siteURL: null
                              }}
                          />
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      contentContainerStyle={Styles.locationList}
                  />
              ) : (
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    {t("screens.list.notFound")}
                  </Text>
              )}
            </>
        )}
      </View>
  );
};

export default List;