import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import html2canvas from 'html2canvas';

const Editor = () => {
    const dispatch = useDispatch();
    const image = useSelector(state => state.editor.image);
    const filters = useSelector(state => state.editor.filters);
    const elements = useSelector(state => state.editor.elements);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            dispatch({ type: 'SET_IMAGE', payload: e.target.result });
        };
        reader.readAsDataURL(file);
    };

    const handleExport = () => {
        html2canvas(document.querySelector("#canvas")).then(canvas => {
            const link = document.createElement("a");
            link.download = "image.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
            <button onClick={handleExport}>Export</button>
            <div id="canvas" style={{ position: 'relative', width: '500px', height: '500px' }}>
                {image && <img src={image} alt="Editor" style={{ ...filters, width: '100%', height: '100%' }} />}
                {elements.map((element, index) => (
                    <div key={index} style={{ position: 'absolute', ...element.style }}>
                        {element.type === 'text' && element.text}
                        {element.type === 'shape' && <div style={element.shapeStyle}></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Editor;
