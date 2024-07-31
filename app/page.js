"use client"
import { Box, Modal, Stack, TextField, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { query, collection, getDocs, setDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
const item = ['tomato', 'onion', 'cucumber', 'kale', 'banana', 'apple', 'cucumber', 'kale', 'banana', 'apple']
export default function Home() {

  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore,
      'pantry'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setPantry(inventoryList)
    console.log(pantry)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()

      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })

    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      bgcolor={'#ffffff'}
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
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
            transform: "translate(-50%, -50%)"
          }}
        >
          <Typography variant="h6" color={"black"}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            >

            </TextField>
            <Button variant="outlined" onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={() => {
        handleOpen()
      }}>ADD NEW ITEM</Button>
      <Box
        border={'1px solid #333'}
      >
        <Box
          width="800px"
          height="100px"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={'#ADD8E5'}
        >
          <Typography
            variant={'h2'}
            color={'#333'}
            textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {
            pantry.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
              >
                <Typography
                  variant={'h2'}
                  color={'#333'}
                  textAlign={'center'}>
                  {
                    name.charAt(0).toUpperCase() + name.slice(1)
                  }
                </Typography>
                <Typography
                  variant={'h2'}
                  color={'#333'}
                  textAlign={'center'}>
                  {
                    quantity
                  }
                </Typography>
                <Stack direction={"row"} gap={2}>
                  <Button variant="contained" onClick={() => {
                    addItem(name)
                  }}>Add</Button>
                  <Button variant="contained" onClick={() => {
                    removeItem(name)
                  }}>Remove</Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box >
  );

}
