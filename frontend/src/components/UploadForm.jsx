import React, { useState } from 'react';
import axios from "axios";


const UploadForm = () => {
    const loginStatus = localStorage.getItem("user") //100% not null since user must be logged in 
    const [selectedFile, setSelectedFile] = useState(null);
    const [caption, setCaption] = useState("");

    // Handle name setting
    const handleCaptionChange = (e) => {
        const caption = e.target.value;
        setCaption(caption);
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    // Handle form submission (you can send the file to your server here)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginStatus + " loginStatus");

        if (selectedFile && selectedFile.type.startsWith('image/') && caption) {
            console.log("Name of Image:", caption);
            console.log("Selected File:", selectedFile);
            // get secure URL from server
            axios.get('http://localhost:3001/s3Url')
            .then(res => {
                const url = res.data.url;
                console.log(url);
                // put image directly to s3 bucket
                axios.put(url, selectedFile, {
                    headers: {
                        'Content-Type': 'image/*'
                    },
                })
                .then(res => {
                    console.log(res.data);
                    // URL of the actual image for the s3 bucket
                    const imageUrl = url.split('?')[0];
                    console.log(imageUrl);
                    // store imageUrl and image name to mongoDB for the current user
                    const imageData = {
                        name: caption,
                        AWSCode: imageUrl
                    }
                    axios.post(`http://localhost:3001/users/${loginStatus}/upload`, imageData)
                    .then(res => {
                        console.log('User imgCollection updated:', res.data);
                        // If everything is successful, notify the user and reset
                        alert("Upload Successful!");
                        setCaption("");
                        setSelectedFile(null);
                    })
                    .catch(err => {
                        console.error('Error updating user imgCollection:', err);
                    });
                })
                .catch(err => {
                    console.error('Error uploading file:', err);
                });
            })
            .catch(err => {
                console.error('Error fetching s3Url:', err);
            });
        } else if(!selectedFile || !caption) {
            alert("Please select a file and specify a name before submitting.");
        } else {
            alert("Please select a valid image file (.jpg, .jpeg, or .png)");
        }
    };

    return (
        <>  
            <h2 className="text-center">Create a New Item</h2>

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                {/* ENTER A LABEL */}
                <div className="my-1 mb-4 mx-auto w-2/3 p-4 border border-black rounded">
                    <label htmlFor="nameInput" className="block mb-2">Enter Name:</label>
                    <input
                        type="text"
                        id="nameInput"
                        placeholder="Enter name"
                        className="w-full p-2 border border-gray-300 rounded"
                        value={caption}
                        onChange={handleCaptionChange}
                    />
                </div>
                {/* UPLOAD A PHOTO */}
                <div className="my-1 mb-4 mx-auto w-2/3 p-4 border border-black rounded">
                    <div className="text-center mb-2">
                        <label htmlFor="fileInput" className="rounded border border-black px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            Choose a file
                            <input
                                type="file"
                                id="fileInput"
                                accept=".jpg, .jpeg, .png, .pdf" // Specify the allowed file types
                                onChange={handleFileChange}
                                className="hidden" // Hide the default file input
                            />
                        </label>
                    </div>
                    <div className="text-center mt-2">
                        <p>{selectedFile ? `Selected File: ${selectedFile.name}` : "No file selected"}</p>
                    </div>
                    <div className="text-center mt-2">
                        <button
                            type="submit"
                            className="rounded border border-black px-4 py-2 hover:bg-gray-100"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </form>

            
        </>
        
    );
}

export default UploadForm;
