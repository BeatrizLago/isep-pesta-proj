import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Video } from "expo-av"; // You may need to install 'expo-av' for video playback

const SignLanguageWord = ({ word, videoUrl }) => {
  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{word}</Text>
      <Video
        source={{ uri: videoUrl }}
        useNativeControls
        resizeMode="contain"
        style={{ width: "100%", height: 200 }}
      />
    </View>
  );
};

export default SignLanguageWord;
