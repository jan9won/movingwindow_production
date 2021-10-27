import React, {useState, Suspense} from 'react';
import MainCanvas from "./MainCanvas";
import Main from "./Main";
import Spinner from "./spinner.gif"

const App = () => {
  const [mainOpacity, setMainOpacity] = useState(0);
  // const [state, setstate] = useState(initialState)
  
  return (
  <div id="App">
    <nav>
      <ul>
        <li><a href="">about</a></li>
        <li><a href="/movingWindow">try it yourself</a></li>
      </ul>
    </nav>
    <h1>THE<br/>MOVING<br/>WINDOW</h1>
		
		<Suspense fallback={<img src={Spinner} id="spinner"/>}>
    <MainCanvas 
      setMainOpacity={setMainOpacity}/>
		</Suspense>
    <div id="scroll"> scroll down to see more </div>

    <Main mainOpacity={mainOpacity}/>
  </div>
  )
};

export default App;
