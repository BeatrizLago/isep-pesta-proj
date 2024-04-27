import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchDataFromFirestore } from "../config/Firestore";

const List = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchDataFromFirestore("locations");
      setData(fetchedData);
    };

    fetchData();
  }, []);

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default List;
