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

const createPlace = ({
  accessLevel,
  city,
  street,
  category,
  phoneNumber,
  email,
  parking = false,
  entrance = false,
  handicapBathroom = false,
  internalCirculation = false,
  visualAlarms = false,
  signLanguage = false,
  writtenDescriptions = false,
  wheelchairWidth = "",
  wheelchairHeight = "",
  latitude,
  longitude,
  siteURL,
  imageURL,
  name,
}) => ({
  accessLevel,
  address: {
    city,
    street,
  },
  category,
  phoneNumber,
  email,
  accessibility: {
    parking,
    entrance,
    handicapBathroom,
    internalCirculation,
    visualAlarms,
    signLanguage,
    writtenDescriptions,
  },
  wheelchair: {
    width: wheelchairWidth,
    height: wheelchairHeight,
  },
  coordinates: {
    latitude,
    longitude,
  },
  siteURL,
  imageURL,
  name,
});

const initialData = [
  createPlace({
    accessLevel: "4",
    city: "Porto",
    street: "Rua de São Filipe de Nery",
    category: "Monumentos",
    phoneNumber: "220145489",
    email: "info@torredosclerigos.pt",
    parking: false,
    entrance: true,
    handicapBathroom: true,
    internalCirculation: true,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: true,
    wheelchairWidth: "100",
    wheelchairHeight: "100",
    latitude: "41.145951771169486",
    longitude: "-8.613813434187623",
    siteURL: "https://www.torredosclerigos.pt/pt/",
    imageURL:
      "https://newinporto.nit.pt/wp-content/uploads/2024/04/eb6f6ff83ce2fdc50474b963780a01c1.jpeg",
    name: "Torre dos Clérigos",
  }),
  createPlace({
    accessLevel: "0",
    city: "Porto",
    street: "Rua das Carmelitas",
    category: "Lazer",
    phoneNumber: null,
    email: "customercare@livrarialello.pt",
    parking: false,
    entrance: false,
    handicapBathroom: false,
    internalCirculation: false,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: false,
    wheelchairWidth: null,
    wheelchairHeight: null,
    latitude: "41.14684959713895",
    longitude: "-8.614892646831137",
    siteURL: "https://www.livrarialello.pt/",
    imageURL:
      "https://www.comerciocomhistoria.gov.pt/wp-content/uploads/import/listings/3351_imagem2.jpg",
    name: "Livraria Lello",
  }),
  createPlace({
    accessLevel: "4",
    city: "Porto",
    street: "Rua de Ferreira Borges",
    category: "Monumentos",
    phoneNumber: "223399000",
    email: "turismo@cciporto.pt",
    parking: false,
    entrance: true,
    handicapBathroom: true,
    internalCirculation: true,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: true,
    wheelchairWidth: "150",
    wheelchairHeight: "100",
    latitude: "41.14139942001962",
    longitude: "-8.61566840718015",
    siteURL: "https://palaciodabolsa.com/",
    imageURL:
      "https://upload.wikimedia.org/wikipedia/commons/3/3b/BolsaValoresPorto.jpg",
    name: "Palácio da Bolsa",
  }),
  createPlace({
    accessLevel: "3",
    city: "Vila Nova de Gaia",
    street: "Jardim do Morro, 4430-210",
    category: "Lazer",
    phoneNumber: "227878120",
    email: "geral@cm-gaia.pt",
    parking: true,
    entrance: true,
    handicapBathroom: true,
    internalCirculation: true,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: false,
    wheelchairWidth: null,
    wheelchairHeight: null,
    latitude: "41.137187229957135",
    longitude: "-8.609288111375953",
    siteURL: "https://www.cm-gaia.pt/pt/",
    imageURL:
      "https://lh3.googleusercontent.com/p/AF1QipOtAkPl81DHXMNsSOv7AzgOZDU6oLkU3wk2gzlY=s1360-w1360-h1020",
    name: "Jardim do Morro",
  }),
  createPlace({
    accessLevel: "1",
    city: "Porto",
    street: "Terreiro da Sé",
    category: "Monumentos",
    phoneNumber: "222059028",
    email: "catedraldoporto@gmail.com",
    parking: false,
    entrance: false,
    handicapBathroom: false,
    internalCirculation: false,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: true,
    wheelchairWidth: "100",
    wheelchairHeight: "100",
    latitude: "41.14301466274586",
    longitude: "-8.611105774187497",
    siteURL: "https://www.diocese-porto.pt/pt/catedral-do-porto/",
    imageURL:
      "https://offloadmedia.feverup.com/portosecreto.co/wp-content/uploads/2022/10/13113440/se-catedral-porto-unsplash-1024x683.jpg",
    name: "Catedral do Porto",
  }),
  createPlace({
    accessLevel: "1",
    city: "Vila Nova de Gaia",
    street: "Largo de Aviz, 4430-329",
    category: "Monumentos",
    phoneNumber: "220142425",
    email: "patrimonioanorte@culturanorte.gov.pt",
    parking: false,
    entrance: true,
    handicapBathroom: false,
    internalCirculation: true,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: true,
    wheelchairWidth: null,
    wheelchairHeight: null,
    latitude: "41.13842367518304",
    longitude: "-8.607536667166048",
    siteURL:
      "https://culturanorte.gov.pt/patrimonio/mosteiro-da-serra-do-pilar/",
    imageURL:
      "https://euroveloportugal.com/files/2016/01/Mosteiro-da-Serra-do-Pilar.jpg",
    name: "Mosteiro da Serra do Pilar",
  }),
  createPlace({
    accessLevel: "2",
    city: "Vila Nova de Gaia",
    street: " Alameda do Sr. da Pedra, 4410",
    category: "Monumentos",
    phoneNumber: "800 210 092",
    email: "null",
    parking: true,
    entrance: false,
    handicapBathroom: false,
    internalCirculation: false,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: false,
    wheelchairWidth: null,
    wheelchairHeight: null,
    latitude: "41.068917289550654",
    longitude: "-8.658605232238742",
    siteURL: "https://www.cm-gaia.pt/pt/",
    imageURL:
      "https://cdn.visitportugal.com/sites/default/files/styles/encontre_detalhe_poi_destaque/public/mediateca/CapelaSenhorPedra-d.jpg?itok=F5fkDDy7",
    name: "Capela do Senhor da Pedra",
  }),
  createPlace({
    accessLevel: "4",
    city: "Vila Nova de Gaia",
    street: "R. Cunha, 4430-812",
    category: "Lazer",
    phoneNumber: "22 787 8120",
    email: "geral_pbiologico@cm-gaia.pt",
    parking: true,
    entrance: true,
    handicapBathroom: false,
    internalCirculation: true,
    visualAlarms: false,
    signLanguage: false,
    writtenDescriptions: true,
    wheelchairWidth: null,
    wheelchairHeight: null,
    latitude: "41.09741989536616",
    longitude: "-8.55435663408678",
    siteURL: "https://parquebiologico.pt/parque-biologico-gaia",
    imageURL: "https://parquebiologico.pt/images/ParqueBiologico/parque.jpg",
    name: "Parque Biológico de Gaia",
  }),
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
