import React from "react";
import { View, Text } from "react-native";

const MyProfile = ({ user }) => {
  return (
    <View>
      {user ? (
        <View>
          <Text>Nome: {user.displayName}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Cadeira de rodas: </Text>
          <Text>Largura: {user.wheelchair.width} cm</Text>
          <Text>Altura: {user.wheelchair.height} cm</Text>
        </View>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
};

export default MyProfile;
