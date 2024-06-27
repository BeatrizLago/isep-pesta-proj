import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import PlaceCard from "../../components/placecard/PlaceCard";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilter from "../../components/myfilter/MyFilter";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import { Styles } from "./List.styles";

const List = ({t}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.location.locations);
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(fetchLocations());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!data.length) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [data.length, fetchData]);

  useEffect(() => {
    if (data.length) {
      setFilteredData(data);
    }
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
    setFilteredData(data);
  }, [data]);

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
            clearFilters={clearFilters}
            showFilter={showFilter}
            t={t}
          />

          <MyFilter
            showFilter={showFilter}
            data={data}
            selectedFilters={selectedFilters}
            setFilteredData={setFilteredData}
            onFilterChange={setSelectedFilters}
            user={user}
            t={t}
          />

          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => <PlaceCard place={item} />}
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
