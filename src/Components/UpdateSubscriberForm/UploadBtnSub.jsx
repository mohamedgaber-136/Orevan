import {useContext,useEffect,useState}  from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { getStorage, ref, uploadBytes,getDownloadURL  } from 'firebase/storage';

export default function UploadBtnSub({setImg,info}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleSelect = (e)=>{
        setSelectedFile(e.target.files[0],'file')
    }

  useEffect(()=>{
    const handleUpload = async () => {
            const storage = getStorage();
            const storageRef = ref(storage, 'images/' + selectedFile.name);
        
            try {
              // Upload the file to Firebase Storage
              await uploadBytes(storageRef, selectedFile);
              // Get the download URL
              const downloadURL = await getDownloadURL(storageRef);
              setImg(downloadURL)        
        console.log(downloadURL)
              // Now, you can save the download URL to Firestore or perform other actions
            } catch (error) {
              console.error('Error uploading file:', error);
            }
          };
          if(selectedFile){
              handleUpload()
          }

  },[selectedFile])
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        width: 1,
      });
  return (<div className='d-flex align-items-center flex-column  '>
    <div className='btnAddNewSub  '>
    <Button  component="label" variant="contained" className={info} startIcon={<CloudUploadIcon />}  >
      <VisuallyHiddenInput type="file" onChange={handleSelect} />
    </Button>
    </div>
    {
        selectedFile&&<span>{selectedFile.name}</span>
    }
    
  </div>
  );
}
