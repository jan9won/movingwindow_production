import React from 'react'
import "../public/styles/main.sass";


const Main = (props) => {

  return (
    <main style={{
      opacity: props.mainOpacity,
      pointerEvents: props.mainOpacity==0?'none':'auto'
      }}>
      <div id="about">
        <h2>About this project.</h2>
        <p>
          <span> This is an interactive art project for my art school graduation. </span>
          <br/>
          <br/> <em>But there’s more objectives over this -</em>
          <strong> I wanted to Demonstrate possibilities of Web Technologies on Art projects.</strong>
          <br/> <br/> I tried to use web technologies as much as I can. They have a great spectrum of ability. I wish more people would try to build art projects with these ultimate possibilities.
        </p>
      </div>
      <div id="tech">
        <h2>Techs used in this project</h2>
        <p>
          <strong>Servers</strong>
          <br /> Nginx
          <br /> Nodejs Express
          <br /> WebSocket
          <br /> <br />
          <strong>Main Contents</strong>
          <br /> JeelizFaceFilter
          <br /> Three.js
          <br /> <br />
          <strong>This Page</strong>
          <br /> React
          <br /> react-three-fiber
          <br /> Scss
          <br /> <br />
          <strong>Physical Actuator</strong>
          <br /> Arduino
          <br /> AccelStepper
          <br /> <br />
        </p>
      
      </div>
    </main>
  )
};

export default Main;