// LocationDetail.js

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LocationDetail = ({ location, onClose }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('DetalhesMapa', { place: location });
    onClose(); // Close the LocationDetail component
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={{ padding: 10, backgroundColor: 'white', borderRadius: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>{location.name}</Text>
        <Text>{location.address.street}, {location.address.city}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LocationDetail;
