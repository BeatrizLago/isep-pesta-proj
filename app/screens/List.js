import React, { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { fetchLocationsFromFirestore } from "../config/Firestore";
import PlaceCard from "../Components/PlaceCard";

const List = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchLocationsFromFirestore("locations");
      setData(fetchedData);
    };

    fetchData();
  }, []);

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => <PlaceCard place={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default List;
