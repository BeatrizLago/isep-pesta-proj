import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";

const PlaceCard = React.memo(({ place }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("Details", { place });
  };

  const { name, address, acessLevel, imageURL } = place;

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={Styles.cardContainer}>
        <Image
          source={{ uri: imageURL }}
          style={Styles.image}
          resizeMode="contain"
        />
        <View style={Styles.detailsContainer}>
          <Text style={Styles.name}>{name}</Text>
          {address && (
            <Text style={Styles.address}>
              {address.city}, {address.street}
            </Text>
          )}
          <Text style={Styles.acessLevel}>
            Nivel de acessibilidade: {acessLevel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default PlaceCard;
