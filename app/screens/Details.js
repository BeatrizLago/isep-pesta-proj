import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
} from "react-native";
import Styles from "../Components/Styles";

const Details = ({ route }) => {
  const { place } = route.params;

  return (
    <ScrollView style={Styles.detailsContainer}>
      <Image source={{ uri: place.imageURL }} style={Styles.detailsImage} />
      <View style={Styles.detailsContent}>
        <Text style={Styles.detailsTitle}>{place.name}</Text>
        <Text style={Styles.detailsCategory}>{place.category}</Text>
        <Text style={Styles.address}>
          Endereço:{" "}
          {place.address
            ? `${place.address.street}, ${place.address.city}`
            : "Endereço não disponível"}
        </Text>
        <Text style={Styles.mbottom}>
          Telefone: {place.phoneNumber || "Telefone não disponível"}
        </Text>
        <Text style={Styles.mbottom}>
          Email: {place.email || "Email não disponível"}
        </Text>
        <Text style={Styles.detailsSubtitle}>Acessibilidade:</Text>
        <Text>
          Estacionamento Prioritário:{" "}
          {place.accessibility?.parking ? "Disponível" : "Não Disponível"}
          {"\n"}Entrada:{" "}
          {place.accessibility?.entrance ? "Acessível" : "Não Acessível"}
          {"\n"}Casa de Banho de Deficientes:{" "}
          {place.accessibility?.handicapBathroom
            ? "Disponível"
            : "Não Disponível"}
          {"\n"}Circulação Interna:{" "}
          {place.accessibility?.internalCirculation
            ? "Acessível"
            : "Não Acessível"}
        </Text>
        <Text style={Styles.detailsSubtitle2}>
          Dimensões para Cadeiras de Rodas:
        </Text>
        <Text style={Styles.mbottom}>
          Largura:{" "}
          {place.wheelchair ? place.wheelchair.width : "Não Especificado"}
          {"\n"}Altura:{" "}
          {place.wheelchair ? place.wheelchair.height : "Não Especificado"}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(place.siteURL)}>
          <Text style={Styles.detailsSiteURL}>
            Website: {place.siteURL || "Nao disponível"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Details;
