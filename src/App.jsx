import React, {useState} from 'react';
import Main from "./Main";

const App = () => {
  
  return (
  <div id="App">
    <nav>
      <ul>
        <li><a href="https://neolambda.studio">Blog</a></li>
        <li><a href="/movingWindow">Try It Yourself</a></li>
      </ul>
    </nav>
		

    <Main/>
  </div>
  )
};

export default App;
