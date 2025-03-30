import express from "express";
import admin from "firebase-admin";
import axios from "axios";
import { firebaseConfig } from "./Firestore.config.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// Get a Firestore reference
const db = admin.firestore();

const app = express();

// Geoapify API Key and URL configuration
const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";
const PLACES_API_URL = "https://api.geoapify.com/v2/places";
const PLACE_DETAILS_API_URL = "https://api.geoapify.com/v2/place-details";

// Route to fetch and save locations from Geoapify
app.get("/fetchAndSaveLocations", async (req, res) => {
  try {
    const coordinates = req.query.coordinates; // Expected format: "lat,lng"
    const radius = req.query.radius || 10000; // Default to 1000 meters
    const category = req.query.category || "commercial.supermarket"; // Default to supermarket category
    const limit = req.query.limit || 90; // Default to 20 locations

    const response = await axios.get(PLACES_API_URL, {
      params: {
        categories: category,
        filter: `rect:${coordinates},${radius}`,
        limit: limit,
        apiKey: GEOAPIFY_API_KEY,
      },
    });

    const locations = response.data.results;

    // Save each location to Firestore
    for (const location of locations) {
      await addDocument("locations", formatLocationData(location));
    }

    res.send(`${locations.length} locations fetched and saved successfully.`);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch documents from Firestore
app.get("/fetchLocations", async (req, res) => {
  try {
    const documents = await fetchDocuments("locations");
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function addDocument(name, data) {
  const docRef = await db.collection(name).add(data);
  console.log("Document added with ID:", docRef.id);
}

async function fetchDocuments(name) {
  const snapshot = await db.collection(name).get();
  const documents = [];
  snapshot.forEach((doc) => {
    documents.push({ id: doc.id, ...doc.data() });
  });
  return documents;
}

// Helper function to format Geoapify data to match your Firestore structure
const formatLocationData = (location) => {
  return {
    name: location.name,
    category: location.categories.join(", "),
    address: {
      city: location.city || "",
      street: location.address_line1 || "",
    },
    coordinates: {
      latitude: location.lat,
      longitude: location.lon,
    },
    siteURL: location.url || "",
    imageURL: location.icon || "", // You can customize this if the API provides better image links
    phoneNumber: location.phone || null,
    email: location.email || null,
    accessibility: {
      parking: location.parking || false,
      entrance: location.entrance || false,
      handicapBathroom: location.handicap_bathroom || false,
      internalCirculation: location.internal_circulation || false,
      visualAlarms: location.visual_alarms || false,
      signLanguage: location.sign_language || false,
      writtenDescriptions: location.written_descriptions || false,
    },
    wheelchair: {
      width: location.wheelchair_width || "",
      height: location.wheelchair_height || "",
    },
  };
};
