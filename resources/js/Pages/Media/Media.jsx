import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Dialog, DialogContent, DialogActions, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { useState } from "react";

export default function Media({images}) {
    const [imageOpen, setImageOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleClickImageOpen = (image) => {
        setSelectedImage(image);
        setImageOpen(true);
    };

    const handleImageClose = () => {
        setImageOpen(false);
        setSelectedImage(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Media Page" />
            <div style={{ display: 'flex', justifyContent: 'center'}}>
            <div className="media-grid" style={{ display: 'flex', justifyContent:'center', flexWrap: 'wrap', gap: '10px'}}>
                {images && images.length > 0 ? (
                    images.map((image, index) => (
                        <div
                            key={index}
                            style={{
                                width: '150px',
                                height: '150px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                textAlign: 'center',
                                backgroundColor: '#f9f9f9',
                            }}
                        >
                            {/* Image */}
                            <div
                                style={{
                                    width: '100%',
                                    height: '80%',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleClickImageOpen(image.url)}
                            >
                                <img
                                    src={image.url}
                                    alt={`Media ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover', // Ensures the image covers the container
                                    }}
                                    loading="lazy"
                                />
                            </div>

                            {/* File Info */}
                            <div style={{ padding: '10px', fontSize: '12px', textAlign: 'center', overflow: 'hidden', width: '100%' }}>
                                {/* <p style={{ margin: 0 }}>{image.name}</p> */}
                                <p style={{ margin: 0, color: '#555' }}>{image.size}</p>
                                <p style={{ margin: 0, color: '#999', fontSize: '10px' }}>
                                    {dayjs(image.date).format('MM/DD/YYYY h:mm A')}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No images found.</p>
                )}
            </div>
            </div>

            <Dialog
                open={imageOpen}
                onClose={handleImageClose}
                maxWidth="md"
                fullWidth
            >
                <DialogContent>
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Selected Media"
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
            
        </AuthenticatedLayout>
    );
}
