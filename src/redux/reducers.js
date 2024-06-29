const initialState = {
    elements: [],
    currentFilter: {}
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'APPLY_FILTER':
            return {
                ...state,
                currentFilter: {
                    ...state.currentFilter,
                    [action.payload.filter]: action.payload.value
                }
            };
        case 'ADD_ELEMENT':
            return {
                ...state,
                elements: [...state.elements, action.payload]
            };
        case 'SET_IMAGE':
            return {
                ...state,
                elements: state.elements.map(element =>
                    element.type === 'image' ? { ...element, src: action.payload } : element
                )
            };
        default:
            return state;
    }
};

export default rootReducer;
