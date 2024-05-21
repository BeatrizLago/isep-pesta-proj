import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput, Button, Linking, TouchableOpacity, Modal } from "react-native";
import { fetchReviewsFromFirestore, addToFirestore } from "../config/Firestore";
import Styles from "../Components/Styles";
import { getAuth } from "firebase/auth"; // Import Firebase auth to get the current user
import { Rating } from 'react-native-ratings'; // Import the Rating component

const Details = ({ route, navigation }) => {
  const { place } = route.params;
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [visRating, setVisRating] = useState(false); // State for controlling the visibility of the modal
  const auth = getAuth();
  const currentUser = auth.currentUser; // Get the current authenticated user

  useEffect(() => {
    const loadReviews = async () => {
      const fetchedReviews = await fetchReviewsFromFirestore(place.id);
      setReviews(fetchedReviews);
    };
    loadReviews();
  }, [place.id]);

  const submitReview = async () => {
    if (!currentUser) {
      console.error("User must be logged in to submit a review");
      return;
    }
    const newReview = {
      text: reviewText,
      rating: rating,
      userId: currentUser.uid,
      date: new Date().toISOString(),
      locationUUID: place.id,
    };
    await addToFirestore("reviews", newReview);
    setReviewText("");
    setRating(0);
    setVisRating(false); // Close the modal after submitting the review
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
            <Button title="Write a Review" onPress={() => setVisRating(true)} />
            <Modal visible={visRating} transparent={true}>
              <View style={{backgroundColor:"#000000aa", flex:1}}>
                <View style={Styles.ratingBarStyle}>
                  <TextInput
                    placeholder="Write a review"
                    value={reviewText}
                    onChangeText={setReviewText}
                    style={Styles.textInput}
                  />
                  <Rating
                    type='custom'
                    ratingCount={5}
                    imageSize={30}
                    showRating
                    startingValue={rating}
                    onFinishRating={setRating}
                  />
                  <Button
                    style={Styles.rateButtonStyle}
                    color="blue"
                    title={`Rate as: ${rating}`}
                    onPress={submitReview}
                  />
                  <Button
                    style={Styles.rateButtonStyle}
                    color="red"
                    title="Cancel"
                    onPress={() => setVisRating(false)}
                  />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Text style={Styles.loginPrompt}>Please log in to write a review.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Details;
