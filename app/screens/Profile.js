import { View, Text,Button } from "react-native";
import React from "react";
import Styles from "../Components/Styles";
import { FIREBASE_AUTH } from "../config/Firebase.config";

const handleLogout = () => {
  FIREBASE_AUTH.signOut();
};

const Profile = () => {
  return (
    <View>
      <Text>{FIREBASE_AUTH.currentUser.displayName}</Text>
      <Button
        title="Logout"
        onPress={() => handleLogout()}
        style={Styles.logoutButton}
      />
    </View>
  );
};

export default Profile;
