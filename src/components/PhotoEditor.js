import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import * as glfx from 'glfx';
import * as bodyPix from '@tensorflow-models/body-pix';

const PhotoEditor = () => {
    const canvasRef = useRef(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    const loadImageToCanvas = (imageSrc) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imageSrc;
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImage(e.target.result);
            loadImageToCanvas(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const applyFilter = (filter) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.filter = filter;
        const img = new Image();
        img.src = uploadedImage;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    };

    const removeBackground = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const net = await bodyPix.load();

        const img = new Image();
        img.src = uploadedImage;
        img.onload = async () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const segmentation = await net.segmentPerson(canvas);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                if (segmentation.data[i / 4] === 0) {
                    data[i + 3] = 0;
                }
            }
            ctx.putImageData(imageData, 0, 0);
        };
    };

    const handleExport = () => {
        html2canvas(canvasRef.current).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'edited-image.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    return (
        <div className="app-container">
            <header>
                Eazy-Edit
            </header>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            
            <div style={{ margin: '20px 0' }}>
                <label>Brightness: </label>
                <input type="range" min="0" max="200" defaultValue="100" onChange={(e) => applyFilter(`brightness(${e.target.value}%)`)} />

                <label>Contrast: </label>
                <input type="range" min="0" max="200" defaultValue="100" onChange={(e) => applyFilter(`contrast(${e.target.value}%)`)} />

                <label>Grayscale: </label>
                <input type="range" min="0" max="100" defaultValue="0" onChange={(e) => applyFilter(`grayscale(${e.target.value}%)`)} />

                <label>Sepia: </label>
                <input type="range" min="0" max="100" defaultValue="0" onChange={(e) => applyFilter(`sepia(${e.target.value}%)`)} />
            </div>

            <button onClick={removeBackground}>Remove Background</button>
            <button onClick={handleExport}>Export</button>

            <div id="canvas-container">
                <canvas ref={canvasRef}></canvas>
            </div>
        </div>
    );
};

export default PhotoEditor;
