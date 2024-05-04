import { View, Button, Text } from "react-native";
import Modal from "react-native-modal";
import React, { useState } from "react";
import Slider from "@react-native-community/slider";
import Styles from "./Styles";

const MyWheelChair = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(40);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View>
      <Button title="Minha cadeira de rodas" onPress={toggleModal} />
      <Modal isVisible={isModalVisible} style={Styles.centerModal}>
        <View style={Styles.centerModalBox}>
          <Slider
            style={{ width: "80%", alignSelf: "center" }}
            value={width}
            minimumValue={50}
            maximumValue={150}
            step={1}
            onValueChange={(value) => setWidth(value)}
          />
          <Text>Largura: {width} cm</Text>
          <Slider
            style={{ width: "80%", alignSelf: "center" }}
            value={height}
            minimumValue={40}
            maximumValue={100}
            step={1}
            onValueChange={(value) => setHeight(value)}
          />
          <Text>Altura: {height} cm</Text>
          <Button title="Hide modal" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

export default MyWheelChair;
