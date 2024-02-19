import { useContext, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, collection } from "firebase/firestore";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
export default function UploadBtn({ id, info }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { EventRefrence } = useContext(FireBaseContext);
  const { dbID } = useParams();
  const eventRef = doc(EventRefrence, dbID);
  const subCollection = collection(eventRef, "Subscribers");
  const handleSelect = (e) => {
    setSelectedFile(e.target.files[0], "file");
  };
  const userRef = doc(subCollection, id);
  // HandleUBLoadp img  in firebase
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
        await updateDoc(userRef, {
          image: downloadURL,
        });

        // Now, you can save the download URL to Firestore or perform other actions
      } catch (error) {
        console.error("Error uploading file:", error);
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
