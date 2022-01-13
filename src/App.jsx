import React, {useState} from 'react';
import Main from "./Main";

const App = () => {
  
  return (
  <div id="App">
    <nav>
      <ul>
        <li><a href="https://neolambda.studio">Blog | 블로그</a></li>
        <li><a href="/movingWindow">Try It | 체험하기</a></li>
      </ul>
    </nav>
		

    <Main/>
  </div>
  )
};

export default App;
