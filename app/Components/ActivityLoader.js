import { View, ActivityIndicator } from "react-native";
import React from "react";

const ActivityLoader = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
};

export default ActivityLoader;
