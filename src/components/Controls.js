import React from 'react';
import { useDispatch } from 'react-redux';

const Controls = () => {
    const dispatch = useDispatch();

    const addText = () => {
        const text = prompt("Enter text:");
        if (text) {
            dispatch({
                type: 'ADD_ELEMENT',
                payload: { type: 'text', text, style: { top: '50%', left: '50%', color: 'black' } }
            });
        }
    };

    const addShape = () => {
        dispatch({
            type: 'ADD_ELEMENT',
            payload: { type: 'shape', style: { top: '50%', left: '50%', width: '50px', height: '50px', backgroundColor: 'red' } }
        });
    };

    const applyFilter = (filter, value) => {
        dispatch({ type: 'APPLY_FILTER', payload: { filter, value } });
    };

    return (
        <div>
            <button onClick={addText}>Add Text</button>
            <button onClick={addShape}>Add Shape</button>
            <div>
                <label>Brightness: </label>
                <input type="range" min="0" max="200" defaultValue="100" onChange={(e) => applyFilter('brightness', `brightness(${e.target.value}%)`)} />
            </div>
            <div>
                <label>Contrast: </label>
                <input type="range" min="0" max="200" defaultValue="100" onChange={(e) => applyFilter('contrast', `contrast(${e.target.value}%)`)} />
            </div>
        </div>
    );
};

export default Controls;
