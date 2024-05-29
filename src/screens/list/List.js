import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import PlaceCard from "../../components/placecard/PlaceCard";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilter from "../../components/myfilter/MyFilter";
import { Styles } from "./List.styles";

const List = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.location.locations);
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

    if (!data.length) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [dispatch, data.length]);

  useEffect(() => {
    if (data.length) {
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await handleRefresh();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [handleRefresh]);

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
          <View style={Styles.bottomBarHeader}>
            <TouchableOpacity
              style={Styles.bottomBarItem}
              onPress={() => toggleFilter()}
            >
              <View>
                <Text style={Styles.filterText}>
                  {showFilter ? "Fechar Filtros" : "Abrir Filtros"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.bottomBarItem1} onPress={clearFilters}>
              <View>
                <Text style={Styles.clearFilterText}>Limpar Filtros</Text>
              </View>
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
              refreshing={refreshing}
              onRefresh={onRefresh}
              contentContainerStyle={Styles.locationList}
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
