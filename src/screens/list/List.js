import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import PlaceCard from "../../components/placecard/PlaceCard";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilter from "../../components/myfilter/MyFilter"

const List = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.location.locations);
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchLocations());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (data.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [dispatch, data.length]);

  useEffect(() => {
    if (data.length > 0) {
      setFilteredData(data);
    }
  }, [data]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(fetchLocations());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

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
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              flexDirection: "row",
              zIndex: 1,
            }}
          >
            <TouchableOpacity
              onPress={toggleFilter}
              style={{ marginRight: 10 }}
            >
              <Text style={{ fontSize: 16, color: "blue" }}>
                {showFilter ? "Close Filter" : "Open Filter"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRefresh}
              style={{ marginRight: 10 }}
            >
              <Text style={{ fontSize: 16, color: "blue" }}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={{ fontSize: 16, color: "red" }}>Clear Filters</Text>
            </TouchableOpacity>
          </View>

          {showFilter && (
            <MyFilter
              data={data}
              selectedFilters={selectedFilters}
              setFilteredData={setFilteredData}
              onFilterChange={setSelectedFilters}
              user={user}
            />
          )}

          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => <PlaceCard place={item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Não foram encontrados dados correspondentes
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default List;
