import React, { useState } from 'react'
import { Button, CircularProgress, TextField, LinearProgress } from '@mui/material';
import { storage, db } from './firebase';
import firebase from 'firebase/app';
import './ImageUpload.css';




function ImageUpload({ username }) {
    const [isUploading, setIsUploading] = useState(false)
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        setIsUploading(true)
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress Function  
                const progress = Math.round(
                    (snapshot.bytesTransferred) / (snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //error function
                console.log(error);
                alert(error.message);
            },
            () => {
                //complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post in db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                        setIsUploading(false)
                    })
            }
        )
    }
    return (
        <div className="imageUpload">
            {/* {handleUpload ? (<h3>File uploaded Successfully</h3>):(<h3>File not uploaded</h3>)} */}

            {isUploading ? (<CircularProgress className="imageUpload__progress" variant="indeterminate" value={progress} max="100" />) : ("")}
            <LinearProgress variant="determinate" value={progress} />
            <TextField className='text__field' type="text" label="Enter a caption" onChange={event => setCaption(event.target.value)} value={caption} /><br />
            <input type="file" placeholder="" onChange={handleChange} />
            <Button className='btn' variant='outlined' onClick={handleUpload}> Upload</Button>
        </div>
    )
}

export default ImageUpload
