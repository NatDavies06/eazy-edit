const initailState = {
    image: null,
    filter: {},
    elements: []
};

const editorReducer = (state = initailState, action) => {
    switch (action.type) {
        case 'SET_IMAGE':
            return {
                ...state,
                image: action.payload
            };
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.filter
            };
        case 'ADD_ELEMENT':
            return {
                ...state,
                elements: [...state.elements, action.payload]
            };
        case 'UPDATE_ELEMENT':
            return {
                ...state,
                elements: state.elements.map((element, index) => {
                    if (index === action.index) {
                        return {
                            ...element,
                            ...action.payload
                        };
                    }
                    return element;
                })
            };
        case 'REMOVE_ELEMENT':
            return {
                ...state,
                elements: state.elements.filter((payload, index) => index !== action.index)
            };
        case 'APPLY_FILTER':
            return {
                ...state,
                image: action.payload
            };
        default:
            return state;
    }
};

export default editorReducer;