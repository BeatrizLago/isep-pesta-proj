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
  StyleSheet, 
} from "react-native";
import {
  fetchReviewsFromFirestore,
  addReviewToFirestore,
} from "../../state/actions/reviewsAction";
import { Styles } from "./Details.styles";
import { Rating } from "react-native-ratings"; 
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { capitalizeWords } from "../../utils/utils";
import { FontAwesome5, FontAwesome } from "react-native-vector-icons";
import { useTranslation } from "react-i18next";

const Details = ({ t }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { place } = route.params;
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [visRating, setVisRating] = useState(false); 
  const user = useSelector((state) => state.user.userInfo);
  const reviews = useSelector((state) => state.review.reviews);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState(null);
  const {  i18n } = useTranslation();

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
    setVisRating(false); 
    await dispatch(fetchReviewsFromFirestore(place.id));
  };

  const handleDirections = () => {
    const { latitude, longitude } = place.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const renderAccessibilityIcon = (isAccessible) => {
    return (
      <FontAwesome
        name={isAccessible ? "check-circle" : "times-circle"}
        size={20}
        color={isAccessible ? "green" : "red"}
        style={Styles.accessibilityIcon}
      />
    );
  };

  const handleTextPress = (type) => {
    let source;
    const currentLang = i18n.language;
    switch (type) {
      case 'category':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/monumentos_en.png")
          : require("../../assets/signlanguage/monumentos_pt.png");
        break;
      case 'address':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/endereco_en.png")
          : require("../../assets/signlanguage/endereco_pt.png");
        break;
      case 'phone':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/telemovel_en.png")
          : require("../../assets/signlanguage/telemovel_pt.png");
        break;
      case 'email':
        source = require("../../assets/signlanguage/email.png");
        break;
      case 'website':
        source = require("../../assets/signlanguage/website.png");
        break;        
      case 'acessibilidade':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/acessibilidade_en.png")
          : require("../../assets/signlanguage/acessibilidade_pt.png");
        break;
      case 'parking':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/estacionamento_en.png")
          : require("../../assets/signlanguage/estacionamento_pt.png");
        break;
      case 'entrance':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/entrada_en.png")
          : require("../../assets/signlanguage/entrada_pt.png");
        break;
      case 'handicapBathroom':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/casadebanho_en.png")
          : require("../../assets/signlanguage/casadebanho_pt.png");
        break;
      case 'internalCirculation':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/circulacao_en.png")
          : require("../../assets/signlanguage/circulacao_pt.png");
        break;
      case 'signLanguage':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/linguagem_en.png")
          : require("../../assets/signlanguage/linguagem_pt.png");
        break;
      case 'visualAlarms':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/alarmes_en.png")
          : require("../../assets/signlanguage/alarmes_pt.png");
        break;
      case 'writtenDescriptions':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/informacao_en.png")
          : require("../../assets/signlanguage/informacao_pt.png");
        break;
      case 'cadeiraderodas':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/cadeira_en.png")
          : require("../../assets/signlanguage/cadeira_pt.png");
        break;
      case 'largura':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/largura_en.png")
          : require("../../assets/signlanguage/largura_pt.png");
        break; 
      case 'altura':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/altura_en.png")
          : require("../../assets/signlanguage/altura_pt.png");
        break; 
      case 'comentarios':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/comentarios_en.png")
          : require("../../assets/signlanguage/comentarios_pt.png");
        break;
      case 'escrever':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/escrever_en.png")
          : require("../../assets/signlanguage/escrever_pt.png");
        break;
      case 'nota':
        source = currentLang === 'en'
          ? require("../../assets/signlanguage/nota_en.png")
          : require("../../assets/signlanguage/nota_pt.png");
        break;                 
        // Add more cases as needed
      default:
        source = null;
    }
    if (source) {
      setImageSource(source);
      setImageModalVisible(true);
    }
  };

  return (
    <ScrollView style={Styles.container}>
      <Image source={{ uri: place.imageURL }} style={Styles.image} />
      <View style={Styles.content}>
        <Text style={Styles.title}>{place.name}</Text>
        <Text style={Styles.category}>{place.category}</Text>

        <TouchableOpacity onPress={() => handleTextPress('address')}>
        <Text style={Styles.text}>
          {t("screens.details.address")}:{" "}
          {place.address
            ? `${place.address.street}, ${place.address.city}`
            : t("screens.details.notAvailable")}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleTextPress('phone')}>
        <Text style={Styles.text}>
          {t("screens.details.telephone")}:{" "}
          {place.phoneNumber || t("screens.details.notAvailable")}
        </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleTextPress('email')}>
        <Text style={Styles.text}>
          {t("screens.details.email")}:{" "}
          {place.email || t("screens.details.notAvailable")}
        </Text>
        </TouchableOpacity>

        <View style={Styles.websiteContainer}>
          <TouchableOpacity onPress={() => handleTextPress('website')}>
            <Text style={Styles.text}>
              {"Website: "}
            </Text>
          </TouchableOpacity>
          {place.siteURL ? (
            <TouchableOpacity onPress={() => Linking.openURL(place.siteURL)}>
              <Text style={Styles.link}>
                {place.siteURL}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={Styles.text}>
              {t("screens.details.notAvailable")}
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={() => handleTextPress('acessibilidade')}> 
          <Text style={Styles.subtitle}>
          {t("screens.details.accessibility")}:
          </Text>
        </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleTextPress('parking')}>
        <Text style={Styles.text}>
          {t("screens.details.parking")}:{" "}
          {place.accessibility?.parking
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {renderAccessibilityIcon(place.accessibility?.parking)}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => handleTextPress('entrance')}>
        <Text style={Styles.text}>
          {t("screens.details.entrance")}:{" "}
          {place.accessibility?.entrance
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {renderAccessibilityIcon(place.accessibility?.entrance)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTextPress('handicapBathroom')}>
        <Text style={Styles.text}>
          {t("screens.details.handicapBathroom")}:{" "}
          {place.accessibility?.handicapBathroom
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {renderAccessibilityIcon(place.accessibility?.handicapBathroom)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTextPress('internalCirculation')}>
        <Text style={Styles.text}>
          {t("screens.details.internalCirculation")}:{" "}
          {place.accessibility?.internalCirculation
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {renderAccessibilityIcon(place.accessibility?.internalCirculation)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTextPress('signLanguage')}>
        <Text style={Styles.text}>
          {t("screens.details.signLanguage")}:{" "}
          {place.accessibility?.signLanguage
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {renderAccessibilityIcon(place.accessibility?.signLanguage)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTextPress('visualAlarms')}>
        <Text style={Styles.text}>
          {t("screens.details.visualAlarms")}:{" "}
          {place.accessibility?.visualAlarms
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {renderAccessibilityIcon(place.accessibility?.visualAlarms)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTextPress('writtenDescriptions')}>
        <Text style={Styles.text}>
          {t("screens.details.writtenDescriptions")}:{" "}
          {place.accessibility?.writtenDescriptions
            ? t("screens.details.available")
            : t("screens.details.notAvailable")}
          {renderAccessibilityIcon(place.accessibility?.writtenDescriptions)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTextPress('cadeiraderodas')}>
        <Text style={Styles.subtitle}>
          {t("screens.details.wheelchair")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleTextPress('largura')}>
        <Text style={Styles.text}>
          {t("screens.details.width")}:{" "}
          {place.wheelchair.width != null
            ? `${place.wheelchair.width} cm`
            : t("screens.details.notAvailable")}
        </Text>
      </TouchableOpacity>

        <TouchableOpacity onPress={() => handleTextPress('altura')}>
          <Text style={Styles.text}>
            {t("screens.details.height")}:{" "}
            {place.wheelchair.height != null
              ? `${place.wheelchair.height} cm`
              : t("screens.details.notAvailable")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDirections} style={Styles.directionsButton}>
          <Text style={Styles.buttonText}>{t("screens.details.directions")}</Text>
          <FontAwesome5 name="directions" size={20} color="#fff" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => handleTextPress('comentarios')}>
        <Text style={Styles.subtitle}>
          {t("screens.details.reviews")}
        </Text>
        </TouchableOpacity>

        {user ? (
          <>
            <TouchableOpacity onPress={() => setVisRating(true)} style={Styles.directionsButton}>
              <Text style={Styles.buttonText}>{t("screens.details.writeReview")}</Text>
              <FontAwesome name="pencil" size={20} color="#fff" style={{ marginLeft: 10 }} />
            </TouchableOpacity>

          <Modal visible={visRating} transparent={true}>
            <View style={Styles.modalOverlay}>
              <View style={Styles.modalContent}>

                <TouchableOpacity onPress={() => handleTextPress('escrever')}>
                <Text style={Styles.modalTitle}>{t("screens.details.writeReview")}</Text>
                </TouchableOpacity>

                <View style={Styles.ratingContainer}>
                  <TouchableOpacity onPress={() => handleTextPress('nota')}>
                  <Text style={Styles.ratingText}>{t("screens.details.rating")}:</Text>
                  </TouchableOpacity>
                  <Rating
                    type="custom"
                    ratingCount={5}
                    imageSize={30}
                    startingValue={rating}
                    onFinishRating={setRating}
                    style={Styles.rating}
                  />
                </View>
                <TextInput
                  placeholder={t("screens.details.writeReviewPlaceholder")}
                  value={reviewText}
                  onChangeText={setReviewText}
                  style={Styles.textInput}
                  multiline
                />
                <View style={Styles.modalButtonContainer}>
                  <TouchableOpacity style={Styles.modalButton} onPress={submitReview}>
                    <FontAwesome name="check" size={20} color="white" style={Styles.buttonIcon} />
                    <Text style={Styles.buttonText}>{t("screens.details.submitReview")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[Styles.modalButton, Styles.cancelButton]} onPress={() => setVisRating(false)}>
                    <FontAwesome name="times" size={20} color="white" style={Styles.buttonIcon} />
                    <Text style={Styles.buttonText}>{t("screens.details.cancel")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          </>
        ) : (
          <Text style={Styles.loginPrompt}>
            Please log in to write a review.
          </Text>
        )}
        
        {reviews.map((review) => (
          <View key={review.id} style={Styles.reviewContainer}>
            <Text style={Styles.reviewAuthor}>{t("screens.details.By")}: {capitalizeWords(review.userName)}</Text>
            <Text style={Styles.reviewText}>{review.text}</Text>
            <Text style={Styles.reviewText}>{t("screens.details.rating")}: {review.rating}/5</Text>
          </View>
        ))}

      </View>

      {/* Modal for showing the sign language image */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          style={Styles.modalOverlay}
          onPress={() => setImageModalVisible(false)}
        >
          <View style={Styles.modalImageContainer}>
            <Image source={imageSource} style={Styles.modalImage} />
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
};

export default Details;

