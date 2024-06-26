import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Styles} from './locationDetail.styles'

const LocationDetail = ({ location, onClose, t }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DetalhesMapa', { place: location });
    onClose(); 
  };

  return (
      <View style = {Styles.container}>
        <View style={Styles.textContainer}>
          <Text style={Styles.locationText}>{location.name}</Text>
          <Text>{location.address.street}, {location.address.city}</Text>
        </View>
          <View style={Styles.buttonContainer}>
            <TouchableOpacity style={Styles.button} onPress={handlePress}>
              <Text style={Styles.buttonText}>{t("components.locationDetail.details")}</Text>
            </TouchableOpacity>
          </View>
      </View>
  );
};

export default LocationDetail;
