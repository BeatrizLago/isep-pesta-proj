import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";

const PlaceCard = ({ place }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Details", { place });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={Styles.cardContainer}>
        <Image source={{ uri: place.image }} style={Styles.image} />
        <View style={Styles.detailsContainer}>
          <Text style={Styles.name}>{place.name}</Text>
          <Text style={Styles.location}>{place.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlaceCard;
