import React, { useState, useEffect } from "react";
import { View, Button, Text } from "react-native";
import Modal from "react-native-modal";
import Slider from "@react-native-community/slider";
import { Styles } from "./MyWheelChair.styles";

const MyWheelChair = ({ handleWheelchairUpdate, user }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [width, setWidth] = useState(user.wheelchair.width);
  const [height, setHeight] = useState(user.wheelchair.height);

  useEffect(() => {
    setWidth(user.wheelchair.width);
    setHeight(user.wheelchair.height);
  }, [user]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleUpdate = () => {
    handleWheelchairUpdate(width, height);
    toggleModal();
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
          <Button title="Atualizar dados" onPress={handleUpdate} />
          <Button title="Hide modal" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

export default MyWheelChair;
