import {
  fetchLocationsFromFirestore,
  addLocationsToFirestore,
} from "./Firestore";

const initializeFirestore = async () => {
  try {
    // Fetch all existing locations from Firestore
    const existingLocations = await fetchLocationsFromFirestore("locations");

    // Data to be added to Firestore
    const initialData = [
      {
        acessLevel: "3",
        address: {
          city: "Porto",
          street: "Rua de São Filipe de Nery",
        },
        description: "",
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
        description: "",
        imageURL:
          "https://www.comerciocomhistoria.gov.pt/wp-content/uploads/import/listings/3351_imagem2.jpg",
        name: "Livraria Lello",
      },
      {
        acessLevel: "",
        address: {
          city: "Porto",
          street: "Praça de Almeida Garrett",
        },
        description: "",
        imageURL:
          "https://upload.wikimedia.org/wikipedia/commons/2/2a/Estação_Ferroviária_de_Porto_-_São_Bento.JPG",
        name: "Estação São Bento",
      },
      {
        acessLevel: "",
        address: {
          city: "Porto",
          street: "Rua de Ferreira Borges",
        },
        description: "",
        imageURL:
          "https://upload.wikimedia.org/wikipedia/commons/3/3b/BolsaValoresPorto.jpg",
        name: "Palácio da Bolsa",
      },
    ];

    // Loop through initialData array
    for (const dataObj of initialData) {
      // Check if the current object already exists in Firestore
      const existingObject = existingLocations.find(
        (location) => location.name === dataObj.name
      );

      // If the object doesn't exist, add it to Firestore
      if (!existingObject) {
        await addLocationsToFirestore(dataObj, "locations");
        console.log(`Location '${dataObj.name}' added to Firestore.`);
      } else {
        console.log(`Location '${dataObj.name}' already exists in Firestore.`);
      }
    }
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

export default initializeFirestore;
