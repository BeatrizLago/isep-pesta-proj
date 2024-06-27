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
import { useRoute } from "@react-navigation/native";

const Details = ({ t }) => {
  const dispatch = useDispatch();
  const route = useRoute();
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
          {t("screens.details.address")}:{" "}
          {place.address
            ? `${place.address.street}, ${place.address.city}`
            : t("screens.details.notAvailable")}
        </Text>
        <Text style={Styles.mbottom}>
          {t("screens.details.telephone")}:{" "}
          {place.phoneNumber || t("screens.details.notAvailable")}
        </Text>
        <Text style={Styles.mbottom}>
          {t("screens.details.email")}:{" "}
          {place.email || t("screens.details.notAvailable")}
        </Text>
        <Text style={Styles.detailsSubtitle}>
          {t("screens.details.accessibility")}:
        </Text>
        <Text>
          {t("screens.details.parking")}:{" "}
          {place.accessibility?.parking
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {"\n"}
          {t("screens.details.entrance")}:{" "}
          {place.accessibility?.entrance
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {"\n"}
          {t("screens.details.handicapBathroom")}:{" "}
          {place.accessibility?.handicapBathroom
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {"\n"}
          {t("screens.details.internalCirculation")}:{" "}
          {place.accessibility?.internalCirculation
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
        </Text>
        <Text style={Styles.detailsSubtitle2}>
          {t("screens.details.wheelchair")}
        </Text>
        <Text style={Styles.mbottom}>
          {t("screens.details.width")}:{" "}
          {place.wheelchair.width != null
            ? `${place.wheelchair.width} cm`
            : t("screens.details.notAvailable")}
          {"\n"}
          {t("screens.details.height")}:{" "}
          {place.wheelchair.height != null
            ? `${place.wheelchair.height} cm`
            : t("screens.details.notAvailable")}
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL(place.siteURL)}>
          <Text style={Styles.detailsSiteURL}>
            Website: {place.siteURL || t("screens.details.notAvailable")}
          </Text>
        </TouchableOpacity>

        <Text style={Styles.detailsSubtitle}>
          {t("screens.details.reviews")}
        </Text>
        {reviews.map((review) => (
          <View key={review.id} style={Styles.reviewContainer}>
            <Text>By: {review.userName}</Text>
            <Text>{review.text}</Text>
            <Text>Rating: {review.rating}/5</Text>
          </View>
        ))}

        {user ? (
          <>
            <Button
              title={t("screens.details.writeReview")}
              onPress={() => setVisRating(true)}
            />
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
