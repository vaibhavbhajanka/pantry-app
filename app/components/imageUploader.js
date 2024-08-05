"use client";
import React, { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Camera } from "react-camera-pro";

const ImageUploader = ({ onImageUpload }) => {
    const cameraRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);

    const captureImage = () => {
        const imageSrc = cameraRef.current.takePhoto();
        setImageSrc(imageSrc);
        onImageUpload(imageSrc);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Capture Item Image
            </Typography>
            {!imageSrc ? (
                <Box>
                    <Camera
                        ref={cameraRef}
                        facingMode="environment"
                        aspectRatio={16 / 9}
                        errorMessages={{
                            noCameraAccessible: "No camera device accessible. Please connect your camera or try a different browser.",
                            permissionDenied: "Permission denied. Please refresh and give camera permission.",
                            switchCamera: "It is not possible to switch camera to different one because there is only one video device accessible.",
                            canvas: "Canvas is not supported.",
                        }}
                    />
                    <Button variant="contained" onClick={captureImage} sx={{ marginTop: 2 }}>
                        Capture Image
                    </Button>
                </Box>
            ) : (
                <Box>
                    <img
                        src={imageSrc}
                        alt="Captured item"
                        style={{ marginTop: 20, maxWidth: "100%" }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => setImageSrc(null)}
                        sx={{ marginTop: 2 }}
                    >
                        Add Another Item
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default ImageUploader;
