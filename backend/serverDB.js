import express from "express";
import admin from "firebase-admin";
import { firebaseConfig } from "./Firestore.config.js";

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// Get a Firestore reference
const db = admin.firestore();

const app = express();

// Route to add a document
app.post("/addLocations", async (req, res) => {
  try {
    // Add document with name "locations"
    await addDocument("locations", req.body);
    res.send("Document added successfully");
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to fetch documents
app.get("/fetchLocations", async (req, res) => {
  try {
    // Fetch documents with name "locations"
    const documents = await fetchDocuments("locations");
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to initialize data
app.post("/initData", async (req, res) => {
  try {
    // Initialize data with initialData
    await initializeData(initialData);
    res.send("Data initialized successfully");
  } catch (error) {
    console.error("Error initializing data:", error);
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

const initialData = [
  {
    acessLevel: "3",
    address: {
      city: "Porto",
      street: "Rua de São Filipe de Nery",
    },
    category: "Monumento",
    description: "",
    phoneNumber: "220145489",
    email: "info@torredosclerigos.pt",
    acessibility: {
      parking: false,
      entrace: false,
      handicapBathroom: true,
      internalCirculation: true,
    },
    wheelchair: {
      width: "",
      height: "",
    },
    siteURL: "https://www.torredosclerigos.pt/pt/",
    imageURL:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Vitoria-Igreja_e_Torre_dos_Clérigos_%281%29_%28cropped%29.jpg",
    name: "Torre dos clérigos",
  },
  {
    acessLevel: "0",
    address: {
      city: "Porto",
      street: "Rua das Carmelitas",
    },
    category: "Lazer",
    description: "",
    phoneNumber: null,
    email: "customercare@livrarialello.pt",
    acessibility: {
      parking: false,
      entrace: false,
      handicapBathroom: false,
      internalCirculation: false,
    },
    wheelchair: {
      width: "",
      height: "",
    },
    siteURL: "https://www.livrarialello.pt/",
    imageURL:
      "https://www.comerciocomhistoria.gov.pt/wp-content/uploads/import/listings/3351_imagem2.jpg",
    name: "Livraria Lello",
  },
  {
    acessLevel: "5",
    address: {
      city: "Porto",
      street: "Rua de Ferreira Borges",
    },
    category: "Monumento",
    description: "",
    phoneNumber: "223399000",
    email: "turismo@cciporto.pt",
    acessibility: {
      parking: true,
      entrace: true,
      handicapBathroom: true,
      internalCirculation: true,
    },
    wheelchair: {
      width: "",
      height: "",
    },
    siteURL: "https://palaciodabolsa.com/",
    imageURL:
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/BolsaValoresPorto.jpg",
    name: "Palácio da Bolsa",
  },
];

async function initializeData(initialData) {
  for (const data of initialData) {
    // Check if a document with the same name already exists
    const existingDocument = await db
      .collection("locations")
      .where("name", "==", data.name)
      .get();
    if (existingDocument.empty) {
      // If no document with the same name exists, add the current data
      await addDocument("locations", data);
    } else {
      // If a document with the same name exists, do nothing
      console.log(
        `Document with name '${data.name}' already exists. Skipping...`
      );
    }
  }
}
