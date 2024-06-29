import React from 'react';
import Editor from './components/Editor';
import Controls from './components/Controls';

const App = () => {
    return (
        <div>
          <h1>Eazy-Edit</h1>
            <Editor />
            <Controls />
        </div>
    );
};

export default App;