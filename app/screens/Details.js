import React from "react";
import { View, Text } from "react-native";

const Details = ({ route }) => {
  const { place } = route.params;

  return (
    <View>
      <Text>{place.name}</Text>
    </View>
  );
};

export default Details;
