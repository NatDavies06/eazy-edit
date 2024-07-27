import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { applyFilter, addElement, setImage } from '../redux/actions';

const PhotoEditor = () => {
    const dispatch = useDispatch();
    const currentFilter = useSelector(state => state.currentFilter);
    const elements = useSelector(state => state.elements);
    const selectedImage = useSelector(state => state.selectedImage);

    const applyFilterHandler = (filter, value) => {
        dispatch(applyFilter(filter, value));
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = () => {
                    dispatch(addElement({ src: image.src, style: { filter: currentFilter } }));
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const handleExport = () => {
        html2canvas(document.querySelector("#canvas")).then(canvas => {
            canvas.toBlob((blob) => {
                const link = document.createElement("a");
                link.download = "image.png";
                link.href = URL.createObjectURL(blob);
                link.click();
            }, 'image/jpeg', 0.7); 
        });
    };

    const removeBackground = async (image) => {
        const formData = new FormData();
        formData.append('image_file', image);

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': 'YOUR_API_KEY'
            },
            body: formData
        });

        const data = await response.blob();
        const imageUrl = URL.createObjectURL(data);
        dispatch(setImage(imageUrl));
    };

    const enhanceImage = async (image) => {
        const formData = new FormData();
        formData.append('image_file', image);

        const response = await fetch('https://api.ai-enhance.com/enhance', {
            method: 'POST',
            body: formData
        });

        const data = await response.blob();
        const imageUrl = URL.createObjectURL(data);
        dispatch(setImage(imageUrl));
        
    };

    return (
        <div>
            <label>Brightness: </label>
            <input type="range" min="0" max="200" defaultValue="100" onChange={(e) => applyFilterHandler('brightness', `brightness(${e.target.value}%)`)} />

            <label>Contrast: </label>
            <input type="range" min="0" max="200" defaultValue="100" onChange={(e) => applyFilterHandler('contrast', `contrast(${e.target.value}%)`)} />

            <label>Grayscale: </label>
            <input type="range" min="0" max="100" defaultValue="0" onChange={(e) => applyFilterHandler('grayscale', `grayscale(${e.target.value}%)`)} />

            <label>Sepia: </label>
            <input type="range" min="0" max="100" defaultValue="0" onChange={(e) => applyFilterHandler('sepia', `sepia(${e.target.value}%)`)} />

            <input type="file" multiple onChange={handleImageUpload} />

            <button onClick={handleExport}>Export</button>

            <button onClick={() => removeBackground(selectedImage)}>Remove Background</button>

            <button onClick={() => enhanceImage(selectedImage)}>Enhance Image</button>

            <div id="canvas">
                {elements.map((element, index) => (
                    <img key={index} src={element.src} style={element.style} alt="Element" />
                ))}
            </div>
        </div>
    );
};

export default PhotoEditor;
