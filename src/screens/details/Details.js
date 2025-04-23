import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput, Linking, TouchableOpacity, Modal } from "react-native";
import axios from "axios";
import { fetchReviewsFromFirestore, addReviewToFirestore } from "../../state/actions/reviewsAction";
import { Styles } from "./Details.styles";
import { Rating } from "react-native-ratings";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import { capitalizeWords } from "../../utils/utils";
import { FontAwesome5, FontAwesome } from "react-native-vector-icons";
import { useTranslation } from "react-i18next";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

const Details = () => {
    const dispatch = useDispatch();
    const route = useRoute();
    const { place } = route.params;
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(0);
    const [visRating, setVisRating] = useState(false);
    const [additionalDetails, setAdditionalDetails] = useState({
        phoneNumber: null,
        email: null,
        siteURL: null,
        accessibility: {
            wheelchairAccessible: false,
            wheelchairToilet: false,
            wheelchairEntrance: false,
            parking: false,
            signLanguage: false,
            visualAlarms: false,
            writtenDescriptions: false
        }
    });
    const user = useSelector((state) => state.user.userInfo);
    const reviews = useSelector((state) => state.review.reviews);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const loadReviews = async () => {
            await dispatch(fetchReviewsFromFirestore(place.id));
        };
        loadReviews();
    }, [place, dispatch]);

    const checkMultipleProperties = (obj, propertyNames) => {
        for (const prop of propertyNames) {
            if (
                obj[prop] === "yes" ||
                obj[prop] === true ||
                obj[prop] === "1" ||
                obj[prop] === "true" ||
                obj[prop] === "designated"
            ) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const fetchGeoapifyDetails = async () => {
            const url = `https://api.geoapify.com/v2/place-details?id=${place.id}&apiKey=${GEOAPIFY_API_KEY}`;
            try {
                const response = await axios.get(url);
                if (response.data && response.data.features && response.data.features.length > 0) {
                    const props = response.data.features[0].properties;
                    const allProperties = {
                        ...props,
                        ...props.datasource?.raw || {},
                        ...props.facilities || {},
                        ...props.accessibility || {}
                    };
                    const wheelchairAccessible = checkMultipleProperties(allProperties, [
                        "wheelchair",
                        "accessible",
                        "wheelchair_access",
                        "handicap",
                        "disabled_access",
                        "accessibility:wheelchair",
                        "disabled_facilities",
                        "wheelchair_accessible"
                    ]);
                    const wheelchairToilet = checkMultipleProperties(allProperties, [
                        "toilets:wheelchair",
                        "toilets_wheelchair",
                        "wheelchair_toilet",
                        "handicap_toilet",
                        "disabled_toilet",
                        "accessible_toilet"
                    ]);
                    const wheelchairEntrance = checkMultipleProperties(allProperties, [
                        "wheelchair:entrance",
                        "wheelchair_entrance",
                        "entrance:wheelchair",
                        "accessible_entrance",
                        "handicap_entrance",
                        "disabled_entrance"
                    ]);
                    const wheelchairParking = checkMultipleProperties(allProperties, [
                        "parking:disabled",
                        "disabled_parking",
                        "handicap_parking",
                        "wheelchair_parking",
                        "accessible_parking"
                    ]);
                    const signLanguage = checkMultipleProperties(allProperties, [
                        "sign_language",
                        "signlanguage",
                        "hearing_impaired:signlanguage",
                        "communication:sign_language"
                    ]);
                    const visualAlarms = checkMultipleProperties(allProperties, [
                        "visual_alarm",
                        "visual_alerts",
                        "hearing_impaired:visual_alarm",
                        "emergency:visual_alert"
                    ]);
                    const writtenDescriptions = checkMultipleProperties(allProperties, [
                        "information:braille",
                        "braille",
                        "tactile_writing",
                        "visual_impaired:tactile",
                        "blind:description"
                    ]);
                    setAdditionalDetails(prev => ({
                        ...prev,
                        phoneNumber: props.contact?.phone || null,
                        email: props.contact?.email || null,
                        siteURL: props.website || props.contact?.website || null,
                        accessibility: {
                            wheelchairAccessible,
                            wheelchairToilet,
                            wheelchairEntrance,
                            parking: wheelchairParking,
                            signLanguage,
                            visualAlarms,
                            writtenDescriptions
                        }
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar detalhes do Geoapify:", error);
            }
        };
        fetchGeoapifyDetails();
    }, [place.id]);

    useEffect(() => {
        const fetchOSMDetails = async () => {
            if (!place.coordinates || !place.coordinates.latitude || !place.coordinates.longitude) return;
            const { latitude, longitude } = place.coordinates;
            const radius = 500;
            const query = `
        [out:json][timeout:25];
        (
          node(around:${radius},${latitude},${longitude})["wheelchair"];
          node(around:${radius},${latitude},${longitude})["toilets:wheelchair"];
          node(around:${radius},${latitude},${longitude})["entrance:wheelchair"];
          node(around:${radius},${latitude},${longitude})["accessible_entrance"];
          node(around:${radius},${latitude},${longitude})["parking:disabled"];
          node(around:${radius},${latitude},${longitude})["accessible_parking"];
          node(around:${radius},${latitude},${longitude})["sign_language"];
          node(around:${radius},${latitude},${longitude})["visual_alarm"];
          node(around:${radius},${latitude},${longitude})["information:braille"];
          way(around:${radius},${latitude},${longitude})["wheelchair"];
          way(around:${radius},${latitude},${longitude})["toilets:wheelchair"];
          way(around:${radius},${latitude},${longitude})["entrance:wheelchair"];
          way(around:${radius},${latitude},${longitude})["accessible_entrance"];
          way(around:${radius},${latitude},${longitude})["parking:disabled"];
          way(around:${radius},${latitude},${longitude})["accessible_parking"];
          way(around:${radius},${latitude},${longitude})["sign_language"];
          way(around:${radius},${latitude},${longitude})["visual_alarm"];
          way(around:${radius},${latitude},${longitude})["information:braille"];
          relation(around:${radius},${latitude},${longitude})["wheelchair"];
          relation(around:${radius},${latitude},${longitude})["toilets:wheelchair"];
          relation(around:${radius},${latitude},${longitude})["entrance:wheelchair"];
          relation(around:${radius},${latitude},${longitude})["accessible_entrance"];
          relation(around:${radius},${latitude},${longitude})["parking:disabled"];
          relation(around:${radius},${latitude},${longitude})["accessible_parking"];
          relation(around:${radius},${latitude},${longitude})["sign_language"];
          relation(around:${radius},${latitude},${longitude})["visual_alarm"];
          relation(around:${radius},${latitude},${longitude})["information:braille"];
        );
        out tags;
      `;
            try {
                const response = await axios.post(
                    "https://overpass-api.de/api/interpreter",
                    `data=${encodeURIComponent(query)}`,
                    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
                );
                if (response.data && response.data.elements && response.data.elements.length > 0) {
                    let osmData = {
                        wheelchairAccessible: false,
                        wheelchairToilet: false,
                        wheelchairEntrance: false,
                        parking: false,
                        signLanguage: false,
                        visualAlarms: false,
                        writtenDescriptions: false
                    };
                    response.data.elements.forEach(element => {
                        const tags = element.tags || {};
                        if (tags.wheelchair === "yes" || tags.wheelchair === "designated")
                            osmData.wheelchairAccessible = true;
                        if (tags["toilets:wheelchair"] === "yes" || tags["toilets:wheelchair"] === "designated")
                            osmData.wheelchairToilet = true;
                        if (
                            tags["entrance:wheelchair"] === "yes" ||
                            tags["entrance:wheelchair"] === "designated" ||
                            tags["accessible_entrance"] === "yes" ||
                            tags["accessible_entrance"] === "designated"
                        )
                            osmData.wheelchairEntrance = true;
                        if (
                            tags["parking:disabled"] === "yes" ||
                            tags["parking:disabled"] === "designated" ||
                            tags["accessible_parking"] === "yes" ||
                            tags["accessible_parking"] === "designated"
                        )
                            osmData.parking = true;
                        if (
                            tags["sign_language"] === "yes" ||
                            tags["sign_language"] === "designated"
                        )
                            osmData.signLanguage = true;
                        if (
                            tags["visual_alarm"] === "yes" ||
                            tags["visual_alarm"] === "designated"
                        )
                            osmData.visualAlarms = true;
                        if (
                            tags["information:braille"] === "yes" ||
                            tags["information:braille"] === "designated"
                        )
                            osmData.writtenDescriptions = true;
                    });
                    setAdditionalDetails(prev => ({
                        ...prev,
                        accessibility: {
                            wheelchairAccessible: prev.accessibility.wheelchairAccessible || osmData.wheelchairAccessible,
                            wheelchairToilet: prev.accessibility.wheelchairToilet || osmData.wheelchairToilet,
                            wheelchairEntrance: prev.accessibility.wheelchairEntrance || osmData.wheelchairEntrance,
                            parking: prev.accessibility.parking || osmData.parking,
                            signLanguage: prev.accessibility.signLanguage || osmData.signLanguage,
                            visualAlarms: prev.accessibility.visualAlarms || osmData.visualAlarms,
                            writtenDescriptions: prev.accessibility.writtenDescriptions || osmData.writtenDescriptions
                        }
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar dados do OSM:", error);
            }
        };
        fetchOSMDetails();
    }, [place.coordinates]);

    const submitReview = async () => {
        if (!user) {
            console.error("User must be logged in to submit a review");
            return;
        }
        const newReview = {
            text: reviewText,
            rating: rating,
            userId: user.id,
            userName: user.displayName,
            date: new Date().toISOString(),
            locationUUID: place.id
        };
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

    const renderAccessibilityIcon = (isAccessible) => (
        <FontAwesome
            name={isAccessible ? "check-circle" : "times-circle"}
            size={20}
            color={isAccessible ? "green" : "red"}
            style={Styles.accessibilityIcon}
        />
    );

    const handleTextPress = (type) => {
        let source;
        const currentLang = i18n.language;
        switch (type) {
            case "category":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/monumentos_en.png")
                    : require("../../assets/signlanguage/monumentos_pt.png");
                break;
            case "address":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/endereco_en.png")
                    : require("../../assets/signlanguage/endereco_pt.png");
                break;
            case "phone":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/telemovel_en.png")
                    : require("../../assets/signlanguage/telemovel_pt.png");
                break;
            case "email":
                source = require("../../assets/signlanguage/email.png");
                break;
            case "website":
                break;
            case "acessibilidade":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/acessibilidade_en.png")
                    : require("../../assets/signlanguage/acessibilidade_pt.png");
                break;
            case "parking":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/estacionamento_en.png")
                    : require("../../assets/signlanguage/estacionamento_pt.png");
                break;
            case "entrance":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/entrada_en.png")
                    : require("../../assets/signlanguage/entrada_pt.png");
                break;
            case "handicapBathroom":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/casadebanho_en.png")
                    : require("../../assets/signlanguage/casadebanho_pt.png");
                break;
            case "internalCirculation":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/circulacao_en.png")
                    : require("../../assets/signlanguage/circulacao_pt.png");
                break;
            case "signLanguage":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/linguagem_en.png")
                    : require("../../assets/signlanguage/linguagem_pt.png");
                break;
            case "visualAlarms":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/alarmes_en.png")
                    : require("../../assets/signlanguage/alarmes_pt.png");
                break;
            case "writtenDescriptions":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/informacao_en.png")
                    : require("../../assets/signlanguage/informacao_pt.png");
                break;
            case "cadeiraderodas":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/cadeira_en.png")
                    : require("../../assets/signlanguage/cadeira_pt.png");
                break;
            case "largura":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/largura_en.png")
                    : require("../../assets/signlanguage/largura_pt.png");
                break;
            case "altura":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/altura_en.png")
                    : require("../../assets/signlanguage/altura_pt.png");
                break;
            case "comentarios":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/comentarios_en.png")
                    : require("../../assets/signlanguage/comentarios_pt.png");
                break;
            case "escrever":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/escrever_en.png")
                    : require("../../assets/signlanguage/escrever_pt.png");
                break;
            case "nota":
                source = currentLang === "en"
                    ? require("../../assets/signlanguage/nota_en.png")
                    : require("../../assets/signlanguage/nota_pt.png");
                break;
            default:
                source = null;
        }
    };

    return (
        <ScrollView style={Styles.container}>
            <View style={Styles.content}>
                <Text style={Styles.title}>{place.name}</Text>
                <TouchableOpacity onPress={() => handleTextPress("address")}>
                    <Text style={Styles.text}>
                        {t("screens.details.address")}:{" "}
                        {place.address ? `${place.address.street}, ${place.address.city}` : t("screens.details.notAvailable")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("phone")}>
                    <Text style={Styles.text}>
                        {t("screens.details.telephone")}:{" "}
                        {additionalDetails.phoneNumber || t("screens.details.notAvailable")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("email")}>
                    <Text style={Styles.text}>
                        {t("screens.details.email")}:{" "}
                        {additionalDetails.email || t("screens.details.notAvailable")}
                    </Text>
                </TouchableOpacity>
                <View style={Styles.websiteContainer}>
                    <TouchableOpacity onPress={() => handleTextPress("website")}>
                        <Text style={Styles.text}>Website: </Text>
                    </TouchableOpacity>
                    {additionalDetails.siteURL ? (
                        <TouchableOpacity onPress={() => Linking.openURL(additionalDetails.siteURL)}>
                            <Text style={Styles.link}>{additionalDetails.siteURL}</Text>
                        </TouchableOpacity>
                    ) : (
                        <Text style={Styles.text}>{t("screens.details.notAvailable")}</Text>
                    )}
                </View>
                <TouchableOpacity onPress={() => handleTextPress("acessibilidade")}>
                    <Text style={Styles.subtitle}>{t("screens.details.accessibility")}:</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("parking")}>
                    <Text style={Styles.text}>
                        {t("screens.details.parking")}:{" "}
                        {(additionalDetails.accessibility.parking || place.accessibility?.parking)
                            ? t("screens.details.available")
                            : t("screens.details.notAvailable")}
                        {renderAccessibilityIcon(
                            additionalDetails.accessibility.parking || place.accessibility?.parking
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("entrance")}>
                    <Text style={Styles.text}>
                        {t("screens.details.entrance")}:{" "}
                        {(additionalDetails.accessibility.wheelchairEntrance || place.accessibility?.entrance)
                            ? t("screens.details.available")
                            : t("screens.details.notAvailable")}
                        {renderAccessibilityIcon(
                            additionalDetails.accessibility.wheelchairEntrance || place.accessibility?.entrance
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("handicapBathroom")}>
                    <Text style={Styles.text}>
                        {t("screens.details.handicapBathroom")}:{" "}
                        {(additionalDetails.accessibility.wheelchairToilet || place.accessibility?.handicapBathroom)
                            ? t("screens.details.available")
                            : t("screens.details.notAvailable")}
                        {renderAccessibilityIcon(
                            additionalDetails.accessibility.wheelchairToilet || place.accessibility?.handicapBathroom
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("internalCirculation")}>
                    <Text style={Styles.text}>
                        {t("screens.details.internalCirculation")}:{" "}
                        {(additionalDetails.accessibility.wheelchairAccessible ||
                            place.accessibility?.internalCirculation)
                            ? t("screens.details.available")
                            : t("screens.details.notAvailable")}
                        {renderAccessibilityIcon(
                            additionalDetails.accessibility.wheelchairAccessible ||
                            place.accessibility?.internalCirculation
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("signLanguage")}>
                    <Text style={Styles.text}>
                        {t("screens.details.signLanguage")}:{" "}
                        {(additionalDetails.accessibility.signLanguage ||
                            place.accessibility?.signLanguage)
                            ? t("screens.details.available")
                            : t("screens.details.notAvailable")}
                        {renderAccessibilityIcon(
                            additionalDetails.accessibility.signLanguage ||
                            place.accessibility?.signLanguage
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("visualAlarms")}>
                    <Text style={Styles.text}>
                        {t("screens.details.visualAlarms")}:{" "}
                        {(additionalDetails.accessibility.visualAlarms ||
                            place.accessibility?.visualAlarms)
                            ? t("screens.details.available")
                            : t("screens.details.notAvailable")}
                        {renderAccessibilityIcon(
                            additionalDetails.accessibility.visualAlarms ||
                            place.accessibility?.visualAlarms
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("writtenDescriptions")}>
                    <Text style={Styles.text}>
                        {t("screens.details.writtenDescriptions")}:{" "}
                        {(additionalDetails.accessibility.writtenDescriptions ||
                            place.accessibility?.writtenDescriptions)
                            ? t("screens.details.available")
                            : t("screens.details.notAvailable")}
                        {renderAccessibilityIcon(
                            additionalDetails.accessibility.writtenDescriptions ||
                            place.accessibility?.writtenDescriptions
                        )}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("cadeiraderodas")}>
                    <Text style={Styles.subtitle}>{t("screens.details.wheelchair")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("largura")}>
                    <Text style={Styles.text}>
                        {t("screens.details.width")}:{" "}
                        {place.wheelchair && place.wheelchair.width != null
                            ? `${place.wheelchair.width} cm`
                            : t("screens.details.notAvailable")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("altura")}>
                    <Text style={Styles.text}>
                        {t("screens.details.height")}:{" "}
                        {place.wheelchair && place.wheelchair.height != null
                            ? `${place.wheelchair.height} cm`
                            : t("screens.details.notAvailable")}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDirections} style={Styles.directionsButton}>
                    <Text style={Styles.buttonText}>{t("screens.details.directions")}</Text>
                    <FontAwesome5 name="directions" size={20} color="#fff" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTextPress("comentarios")}>
                    <Text style={Styles.subtitle}>{t("screens.details.reviews")}</Text>
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
                                    <TouchableOpacity onPress={() => handleTextPress("escrever")}>
                                        <Text style={Styles.modalTitle}>{t("screens.details.writeReview")}</Text>
                                    </TouchableOpacity>
                                    <View style={Styles.ratingContainer}>
                                        <TouchableOpacity onPress={() => handleTextPress("nota")}>
                                            <Text style={Styles.ratingText}>{t("screens.details.rating")}:</Text>
                                        </TouchableOpacity>
                                        <Rating type="custom" ratingCount={5} startingValue={rating} onFinishRating={setRating} style={Styles.rating} />
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
                    <Text style={Styles.loginPrompt}>{t("screens.details.loginToReview")}</Text>
                )}
                {reviews.map((review) => (
                    <View key={review.id} style={Styles.reviewContainer}>
                        <Text style={Styles.reviewAuthor}>
                            {t("screens.details.By")}: {capitalizeWords(review.userName)}
                        </Text>
                        <Text style={Styles.reviewText}>{review.text}</Text>
                        <Text style={Styles.reviewText}>
                            {t("screens.details.rating")}: {review.rating}/5
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default Details;