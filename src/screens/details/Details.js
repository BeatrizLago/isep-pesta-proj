import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Button,
  Linking,
  TouchableOpacity,
  Modal,
  StyleSheet, // Import StyleSheet for defining styles
} from "react-native";
import {
  fetchReviewsFromFirestore,
  addReviewToFirestore,
} from "../../state/actions/reviewsAction";
import { Styles } from "./Details.styles";
import { Rating } from "react-native-ratings"; // Import the Rating component
import { useDispatch, useSelector } from "react-redux";

const Details = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { place } = route.params;
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [visRating, setVisRating] = useState(false); // State for controlling the visibility of the modal
  const user = useSelector((state) => state.user.userInfo);
  const reviews = useSelector((state) => state.review.reviews);

  useEffect(() => {
    const loadReviews = async () => {
      await dispatch(fetchReviewsFromFirestore(place.id));
    };
    loadReviews();
  }, [place, dispatch]);

  const submitReview = async () => {
    if (!user) {
      console.error("User must be logged in to submit a review");
      return;
    }
    console.log(user);

    const newReview = {
      text: reviewText,
      rating: rating,
      userId: user.id,
      userName: user.displayName,
      date: new Date().toISOString(),
      locationUUID: place.id,
    };

    console.log(newReview);

    await dispatch(addReviewToFirestore(newReview));
    setReviewText("");
    setRating(0);
    setVisRating(false); // Close the modal after submitting the review
    await dispatch(fetchReviewsFromFirestore(place.id));
  };

  return (
    <ScrollView style={Styles.detailsContainer}>
      <Image source={{ uri: place.imageURL }} style={Styles.detailsImage} />
      <View style={Styles.detailsContent}>
        <Text style={Styles.detailsTitle}>{place.name}</Text>
        <Text style={Styles.detailsCategory}>{place.category}</Text>
        <Text style={Styles.address}>
          Endereço:{" "}
          {place.address
            ? `${place.address.street}, ${place.address.city}`
            : "Endereço não disponível"}
        </Text>
        <Text style={Styles.mbottom}>
          Telefone: {place.phoneNumber || "Telefone não disponível"}
        </Text>
        <Text style={Styles.mbottom}>
          Email: {place.email || "Email não disponível"}
        </Text>
        <Text style={Styles.detailsSubtitle}>Acessibilidade:</Text>
        <Text>
          Estacionamento Prioritário:{" "}
          {place.accessibility?.parking ? "Disponível" : "Não Disponível"}
          {"\n"}Entrada:{" "}
          {place.accessibility?.entrance ? "Acessível" : "Não Acessível"}
          {"\n"}Casa de Banho de Deficientes:{" "}
          {place.accessibility?.handicapBathroom
            ? "Disponível"
            : "Não Disponível"}
          {"\n"}Circulação Interna:{" "}
          {place.accessibility?.internalCirculation
            ? "Acessível"
            : "Não Acessível"}
        </Text>
        <Text style={Styles.detailsSubtitle2}>
          Dimensões para Cadeiras de Rodas:
        </Text>
        <Text style={Styles.mbottom}>
          Largura:{" "}
          {place.wheelchair ? place.wheelchair.width : "Não Especificado"}
          {"\n"}Altura:{" "}
          {place.wheelchair ? place.wheelchair.height : "Não Especificado"}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(place.siteURL)}>
          <Text style={Styles.detailsSiteURL}>
            Website: {place.siteURL || "Nao disponível"}
          </Text>
        </TouchableOpacity>

        <Text style={Styles.detailsSubtitle}>Reviews</Text>
        {reviews.map((review) => (
          <View key={review.id} style={Styles.reviewContainer}>
            <Text>By: {review.userName}</Text>
            <Text>{review.text}</Text>
            <Text>Rating: {review.rating}/5</Text>
          </View>
        ))}

        {user ? (
          <>
            <Button title="Escrever Review" onPress={() => setVisRating(true)} />
            <Modal visible={visRating} transparent={true}>
              <View style={Styles.modalOverlay}>
                <View style={Styles.modalContent}>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={30}
                    showRating
                    startingValue={rating}
                    onFinishRating={setRating}
                    style={Styles.rating}
                  />
                  <TextInput
                    placeholder="Escrever review"
                    value={reviewText}
                    onChangeText={setReviewText}
                    style={Styles.textInput}
                  />
                  <Button
                    style={Styles.button}
                    color="blue"
                    title="Submeter Review"
                    onPress={submitReview}
                  />
                  <Button
                    style={Styles.button}
                    color="red"
                    title="Cancelar"
                    onPress={() => setVisRating(false)}
                  />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Text style={Styles.loginPrompt}>
            Please log in to write a review.
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Details;
