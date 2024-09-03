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

export default function UploadBtn({ id, info, element }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const { SubscribersRefrence, EventRefrence } = useContext(FireBaseContext);

  const handleSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const subscriberDocRef = id && typeof id === "string" ? doc(SubscribersRefrence, id) : null;
  const eventDocRef = element?.eventID ? doc(EventRefrence, element.eventID) : null;
  const eventSubScriber = eventDocRef ? doc(collection(eventDocRef, "Subscribers"), id) : null;

  useEffect(() => {
    if (!id || typeof id !== "string" || !selectedFile || !subscriberDocRef || !eventSubScriber) {
      return;
    }

    let isMounted = true; // Track if the component is mounted

    const handleUpload = async () => {
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + selectedFile.name);

      try {
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);

        if (isMounted) {
          // Update the document in SubscribersRefrence
          await updateDoc(subscriberDocRef, { sign64data: downloadURL });
          await updateDoc(eventSubScriber, { sign64data: downloadURL });
        }
      } catch (error) {
      }
    };

    handleUpload();

    return () => {
      isMounted = false; // Clean up on component unmount
    };
  }, [selectedFile, subscriberDocRef, eventSubScriber, id]);

  // Optionally, you can display an error message or disabled button if `id` is invalid
  if (!id || typeof id !== "string") {
    return <p>Error: Invalid ID</p>;
  }

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
