import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Styles from "./Styles"

const PlaceCard = ({ place }) => {
  return (
    <View style={Styles.cardContainer}>
      <Image source={{ uri: place.image }} style={Styles.image} />
      <View style={Styles.detailsContainer}>
        <Text style={Styles.name}>{place.name}</Text>
        <Text style={Styles.location}>{place.location}</Text>
      </View>
    </View>
  );
};

export default PlaceCard;
