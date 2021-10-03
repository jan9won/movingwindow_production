import React, { useRef } from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


const Actuator = (props) => {

  const actuatorRef = useRef();
  const scrollRatio = 1.5;
  const scrollLimit = 720;

  onscroll = (evt) => {
    console.log(window.scrollY);
    // console.log(evt);
    if(actuatorRef.current){
      if(window.scrollY<scrollLimit){
        actuatorRef.current.position.z = -560 + window.scrollY/scrollRatio ;
        props.setMainOpacity(0);
      } else {
        actuatorRef.current.position.z = -560 + scrollLimit/scrollRatio;
        props.setMainOpacity(1);
      }
    }
  }
  onmousemove = (evt) => {
    console.log(evt.clientX/window.innerWidth,evt.clientY/window.innerHeight);
  }
  
  try{
      ontouchmove = (evt) => {
      console.log(
        evt.changedTouches[0].clientX/window.innerWidth,
        evt.changedTouches[0].clientY/window.innerHeight
      );
    }
  } catch {
    console.log('not mobile no touch');
  }

  const { nodes } = useLoader(GLTFLoader, "/assets/actuator_model/compressed.glb", loader => {
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/assets/actuator_model/');
		loader.setDRACOLoader(dracoLoader);
	});
  return (
    <mesh ref={actuatorRef} name="frame" position={[0,-66,-560]} rotation={[-Math.PI/2,0,0]}>
      <bufferGeometry attach="geometry" {...nodes['1_frame'].geometry} />
      <meshStandardMaterial attach="material" {...nodes['1_frame'].material} name="Material" />
      <mesh name="vertical" position={[0,-5,68]}>
        <bufferGeometry attach="geometry" {...nodes['2_vertical'].geometry} />
        <meshStandardMaterial attach="material" {...nodes['2_vertical'].material} name="Material" />
        <mesh name="ipad" position={[.4,-5,-3]} 
        onPointerDown={e => console.log('down')}
        onPointerUp={e => console.log('up')}
        >
          <bufferGeometry attach="geometry" {...nodes['3_ipad'].geometry} />
          <meshStandardMaterial attach="material" {...nodes['3_ipad'].material} name="Material" />
          <mesh name="screen" position={[-.35,-.8,1]}>
            <bufferGeometry attach="geometry" {...nodes['4_screen'].geometry} />
            <meshStandardMaterial attach="material" {...nodes['4_screen'].material} name="Material" />
          </mesh>
        </mesh>
      </mesh>
    </mesh>
  );
};

export default Actuator;
