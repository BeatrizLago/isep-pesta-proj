import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, Button, Linking, TouchableOpacity } from "react-native";
import { fetchReviewsFromFirestore, addReviewToFirestore, addToFirestore } from "../config/Firestore";
import Styles from "../Components/Styles";
import { getAuth } from "firebase/auth"; // Import Firebase auth to get the current user

const Details = ({ route, navigation }) => {
  const { place } = route.params;
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const auth = getAuth();
  const currentUser = auth.currentUser; // Get the current authenticated user


  useEffect(() => {
    const loadReviews = async () => {
      const fetchedReviews = await fetchReviewsFromFirestore(place.id);
      setReviews(fetchedReviews);
    };
    loadReviews();
  }, [place.id]);

  const handleAddReview = async () => {
    if (!currentUser) {
      console.error("User must be logged in to submit a review");
      return;
    }
    const newReview = {
      text: reviewText,
      rating: rating,
      userId: currentUser.uid,
      date: new Date().toISOString(),
      locationUUID: place.id, // Ensure this field is included
    };
    await addToFirestore("reviews", newReview);
    setReviewText("");
    setRating(0);
    const updatedReviews = await fetchReviewsFromFirestore(place.id);
    setReviews(updatedReviews);
  };

  return (
    <ScrollView style={Styles.detailsContainer}>
      <Image source={{ uri: place.imageURL }} style={Styles.detailsImage} />
      <View style={Styles.detailsContent}>
        <Text style={Styles.detailsTitle}>{place.name}</Text>
        <Text style={Styles.detailsCategory}>{place.category}</Text>
        <Text style={Styles.address}>
          Endereço: {place.address ? `${place.address.street}, ${place.address.city}` : "Endereço não disponível"}
        </Text>
        <Text style={Styles.mbottom}>Telefone: {place.phoneNumber || "Telefone não disponível"}</Text>
        <Text style={Styles.mbottom}>Email: {place.email || "Email não disponível"}</Text>
        <Text style={Styles.detailsSubtitle}>Acessibilidade:</Text>
        <Text>
          Estacionamento Prioritário: {place.accessibility?.parking ? "Disponível" : "Não Disponível"}
          {"\n"}Entrada: {place.accessibility?.entrance ? "Acessível" : "Não Acessível"}
          {"\n"}Casa de Banho de Deficientes: {place.accessibility?.handicapBathroom ? "Disponível" : "Não Disponível"}
          {"\n"}Circulação Interna: {place.accessibility?.internalCirculation ? "Acessível" : "Não Acessível"}
        </Text>
        <Text style={Styles.detailsSubtitle2}>Dimensões para Cadeiras de Rodas:</Text>
        <Text style={Styles.mbottom}>
          Largura: {place.wheelchair ? place.wheelchair.width : "Não Especificado"}
          {"\n"}Altura: {place.wheelchair ? place.wheelchair.height : "Não Especificado"}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(place.siteURL)}>
          <Text style={Styles.detailsSiteURL}>Website: {place.siteURL || "Nao disponível"}</Text>
        </TouchableOpacity>

        <Text style={Styles.detailsSubtitle}>Reviews</Text>
        {reviews.map((review) => (
          <View key={review.id} style={Styles.reviewContainer}>
            <Text>{review.text}</Text>
            <Text>Rating: {review.rating}/5</Text>
            <Text>By: {review.userId}</Text>
            <Text>Date: {new Date(review.date).toLocaleDateString()}</Text>
          </View>
        ))}

        {currentUser ? (
          <>
            <TextInput
              placeholder="Write a review"
              value={reviewText}
              onChangeText={setReviewText}
              style={Styles.textInput}
            />
            <TextInput
              placeholder="Rating (1-5)"
              value={rating}
              onChangeText={(text) => setRating(Number(text))}
              style={Styles.textInput}
              keyboardType="numeric"
            />
            <Button title="Submit Review" onPress={handleAddReview} />
          </>
        ) : (
          <Text style={Styles.loginPrompt}>Please log in to write a review.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Details;
