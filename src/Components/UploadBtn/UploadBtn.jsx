import { useContext, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, updateDoc } from "firebase/firestore";
import { FireBaseContext } from "../../Context/FireBase";

// Styled component for hidden file input
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  whiteSpace: "nowrap",
  width: 1,
});

// Apply larger size directly to the Button component and its icon
export default function UploadBtn({ id, info, element }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { SubscribersRefrence, EventRefrence } = useContext(FireBaseContext);

  const handleSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Ensure id.id is a string
  // Reference to the specific subscriber document in SubscribersRefrence
  const subscriberDocRef = doc(SubscribersRefrence, id);
  const eventDocRef = doc(EventRefrence, element.eventID);
  const eventSubScriber = doc(collection(eventDocRef, "Subscribers"), id);

  useEffect(() => {
    const handleUpload = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + selectedFile.name);
      try {
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, selectedFile);
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Update the document in SubscribersRefrence
        await updateDoc(subscriberDocRef, {
          sign64data: downloadURL,
        });
        await updateDoc(eventSubScriber, {
          sign64data: downloadURL,
        });

        // Now, you can save the download URL to Firestore or perform other actions
      } catch (error) {
      }
    };

    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  return (
    <Button
      component="label"
      variant="contained"
      className={info}
      sx={{
        backgroundColor: "white",
        padding: "10px", // Adjust padding to control the background size
        "& .MuiSvgIcon-root": {
          fontSize: "1rem", // Adjust font size to control the icon size
          color: "blue", // Optional: change icon color
        },
      }}
      startIcon={<CloudUploadIcon />}
    >
      <VisuallyHiddenInput type="file" onChange={handleSelect} />
    </Button>
  );
}
