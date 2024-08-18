import { useContext, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, updateDoc } from "firebase/firestore";
import { FireBaseContext } from "../../Context/FireBase";

export default function UploadBtn({ id, info,element }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { SubscribersRefrence ,EventRefrence } = useContext(FireBaseContext);

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
        console.log("File uploaded successfully. Download URL:", downloadURL);

        // Update the document in SubscribersRefrence
        await updateDoc(subscriberDocRef, {
          sign64data: downloadURL,
        });
        await updateDoc(eventSubScriber, {
          sign64data: downloadURL,
        });

        // Now, you can save the download URL to Firestore or perform other actions
      } catch (error) {
        console.log("Error uploading file:", error);
      }
    };

    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Button
      component="label"
      variant="contained"
      className={info}
      startIcon={<CloudUploadIcon />}
    >
      <VisuallyHiddenInput type="file" onChange={handleSelect} />
    </Button>
  );
}
