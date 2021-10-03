import React, { Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import Actuator from "./Actuator"

const MainCanvas = (props) => {

  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.toneMapping = null ;
        gl.antialias = false;
      }}
      pixelRatio={window.devicePixelRatio}
      style={{
        position:'fixed',
        zIndex:90,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
      camera={{
        position:[0,0, 0],
        fov:30,
        far:2000
      }}
      >
      
      <pointLight position={[0, 200, 200]} />

        <Actuator 
        setMainOpacity={props.setMainOpacity}
        />

    </Canvas>
  )
}

export default MainCanvas;
