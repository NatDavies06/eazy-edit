import { combineReducers } from 'redux';
import editorReducer from './editorReducer';
import e from 'express';

export default combineReducers({
    editor: editorReducer
});