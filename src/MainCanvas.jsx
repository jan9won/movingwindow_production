import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import Actuator from "./Actuator"


const Dolly = (props) => {
  // This one makes the camera move in and out
  useFrame(({ camera }) => {
		if(props.scrollValue < 720){
			camera.position.z = 200-props.scrollValue
		} else {
			camera.position.z = -520 
		}
  })
  return null
}
const MainCanvas = React.forwardRef((props,ref) => {

  return (
    <Canvas
		  className={props.mainOpacity ? "opacity-0" : "opacity-100"}
      onCreated={({ gl }) => {
        gl.toneMapping = null ;
        gl.antialias = false;
      }}
      pixelRatio={window.devicePixelRatio}
      camera={{
        position:[0,0,0],
        fov:30,
        far:2000
      }}
      >
      
      <pointLight position={[0, 200, 200]} />
			<Suspense fallback={null}>
        <Actuator
		  		ref={ref}
					scrollValue={props.scrollValue}/>
			</Suspense>
			<Dolly scrollValue={props.scrollValue}/>
    </Canvas>
  )
})

export default MainCanvas;
