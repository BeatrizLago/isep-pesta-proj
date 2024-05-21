import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { addToFirestore } from "../config/Firestore";

const WriteReview = () => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { placeId } = route.params;
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleSubmitReview = async () => {
    if (!currentUser) {
      console.error("User must be logged in to submit a review");
      return;
    }
    const newReview = {
      text: reviewText,
      rating: parseInt(rating),
      userId: currentUser.uid,
      date: new Date().toISOString(),
      locationUUID: placeId,
    };
    await addToFirestore("reviews", newReview);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Write a review"
        value={reviewText}
        onChangeText={setReviewText}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Rating (1-5)"
        value={rating}
        onChangeText={setRating}
        style={styles.textInput}
        keyboardType="numeric"
      />
      <Button title="Submit Review" onPress={handleSubmitReview} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default WriteReview;
