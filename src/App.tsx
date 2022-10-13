import React from 'react';

import '../src/Styles/App.css';
import { BaseFrame } from './Frames/BaseFrame';


function App() {
  return (
    <div className='container mx-1 my-1 '>
      <BaseFrame pos_x={0} pos_y={0} />

    </div>
  );
}

export default App;
