export const applyFilter = (filter, value) => ({
    type: 'APPLY_FILTER',
    payload: { filter, value }
});

export const addElement = (element) => ({
    type: 'ADD_ELEMENT',
    payload: element
});

export const setImage = (image) => ({
    type: 'SET_IMAGE',
    payload: image
});
