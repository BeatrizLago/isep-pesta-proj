import React from "react";
import { View } from "react-native";
import { Overlay, Button } from "@rneui/themed";
import AutoComplete from "../../components/autoCompleteInput/AutoComplete";
import { Picker } from "@react-native-picker/picker";

const Directions = ({
  visible,
  toggleOverlay,
  locations,
  handleSelectLocation,
  setStartLocation,
  setEndLocation,
  handleDirections,
  profile,
  setProfile,
}) => {
  const profiles = [
    { key: "wheelchair", label: "cadeira de rodas" },
    { key: "driving-car", label: "carro" },
    { key: "foot-walking", label: "pé" },
  ];

  return (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <AutoComplete
        data={locations}
        placeholder="Enter start location"
        onSelect={(name) => handleSelectLocation(name, setStartLocation)}
      />
      <AutoComplete
        data={locations}
        placeholder="Enter destination"
        onSelect={(name) => handleSelectLocation(name, setEndLocation)}
      />
      <View>
        <Picker
          selectedValue={profile}
          onValueChange={(itemValue) => setProfile(itemValue)}
        >
          <Picker.Item label={"pick a method"} value="" />
          {profiles.map((profiles) => (
            <Picker.Item
              key={profiles.key}
              label={profiles.label}
              value={profiles.key}
            />
          ))}
        </Picker>
      </View>
      <Button
        title="Give directions"
        onPress={() => {
          toggleOverlay();
          handleDirections();
        }}
      />
    </Overlay>
  );
};

export default Directions;
