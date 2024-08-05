"use client";
import { Box, Modal, Stack, TextField, Typography, Button, Alert, Snackbar, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { query, collection, getDocs, setDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import ImageUploader from "./components/imageUploader";
import { convertImageToBase64 } from "./utils/imageUtils";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(false);


  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setPantry(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
        setAlert({ open: true, message: `"${item}" removed from the pantry.`, severity: "warning" });
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
      setAlert({ open: true, message: `"${item}" added to the pantry.`, severity: "success" });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenImageModal = () => setOpenImageModal(true);
  const handleCloseImageModal = () => setOpenImageModal(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const handleImageUpload = (imageSrc) => {
    convertImageToBase64(imageSrc, async (imageBase64) => {
      setLoadingImage(true);
      try {
        const response = await fetch("/api/classify-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64 }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to classify image");
        }
  
        const data = await response.json();
        const itemName = data.label;
        await addItem(itemName);
        setItemName("");
        handleCloseImageModal();
      } catch (error) {
        console.error("Error processing image: ", error);
      } finally {
        setLoadingImage(false);
      }
    });
  };
  

  const handleGenerateRecipe = async () => {
    setLoadingRecipe(true);
    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pantryItems: pantry.map((item) => item.name) }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate recipe");
      }
  
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error generating recipe: ", error);
    } finally {
      setLoadingRecipe(false);
    }
  };
  

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" bgcolor="#ffffff">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding={2}
        bgcolor="#f5f5f5"
        borderBottom="1px solid #ddd"
      >
        <TextField
          variant="outlined"
          placeholder="Search items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: "600px", width: "100%" }}
        />
        <Button color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Box display="flex" flex={1}>
        <Box flex={1} borderRight="1px solid #ddd" padding={2} overflow="auto">
          <Typography variant="h5" color="#333" textAlign="center" marginBottom={2}>
            Pantry Items
          </Typography>
          <Stack spacing={2}>
            {filteredPantry.map(({ name, quantity }) => (
              <Box
                key={name}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                bgcolor="#f0f0f0"
                borderRadius="8px"
              >
                <Typography variant="h6" color="#333">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="#333">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" color="success" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" color="warning" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
        <Box flex={1} padding={2} display="flex" flexDirection="column" alignItems="center">
          <Stack direction="row" spacing={2} width="100%">
            <Button variant="contained" onClick={handleOpenAddModal} fullWidth>
              Add New Item
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenImageModal} fullWidth>
              Add Item Using Camera
            </Button>
            <Button variant="contained" color="secondary" onClick={handleGenerateRecipe} fullWidth>
              Generate Recipe
            </Button>
          </Stack>
          {loadingRecipe ? (
          <CircularProgress sx={{ marginTop: "20px" }} />
        ) : (
          <Box border="1px solid #333" sx={{ width: "100%", padding: "20px", marginTop: "20px" }}>
            <Typography variant="h4" color="#333" textAlign="center" marginBottom="20px">
              Generated Recipe
            </Typography>
            <Typography variant="body1" color="#333" style={{ whiteSpace: "pre-wrap" }}>
              {recipe
                ? recipe
                : "No recipe generated yet. Click the 'Generate Recipe' button to create a recipe."}
            </Typography>
          </Box>
        )}
        </Box>
      </Box>
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" color="black">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleCloseAddModal();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal open={openImageModal} onClose={handleCloseImageModal}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          {loadingImage ? (
          <CircularProgress />
        ) : (
          <ImageUploader onImageUpload={handleImageUpload} />
        )}
        </Box>
      </Modal>
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
