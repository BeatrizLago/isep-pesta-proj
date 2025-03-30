import React from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Styles } from "./PlaceCard.styles";

const PlaceCard = React.memo(({ place }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("DetalhesLista", { place });
    };

    const { name, address, accessLevel} = place;

    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={Styles.cardContainer}>
                    <View style={Styles.accessLevelContainer}>
                        <Text style={Styles.accessLevel}>{accessLevel}</Text>
                    </View>
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.8)"]}
                        style={Styles.gradient}
                    >
                        <View style={Styles.detailsContainer}>
                            <Text style={Styles.name}>{name}</Text>
                            {address && (
                                <Text style={Styles.address}>
                                    {address.city}, {address.street}
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
            </View>
        </TouchableOpacity>
    );
});

export default PlaceCard;