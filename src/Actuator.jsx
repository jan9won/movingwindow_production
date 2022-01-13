import React, {useEffect}  from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


const Actuator = (props) => {

//  onmousemove = (evt) => {
//    console.log(evt.clientX/window.innerWidth,evt.clientY/window.innerHeight);
//  }

  const { nodes } = useLoader(GLTFLoader, "/assets/actuator_model/compressed.glb", loader => {
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/assets/actuator_model/');
		loader.setDRACOLoader(dracoLoader);
	});
	
	useEffect(()=>{
		props.setIsLoaded(true)
	},[nodes])

  return (
    <mesh name="frame" position={[0,-66,-560]} rotation={[-Math.PI/2,0,0]}>
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
