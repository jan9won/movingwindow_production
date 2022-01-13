
/*=============== PRODUCTION dependency ===============*/

import * as THREE from  "./threejs/build/three.module.js";
import { GLTFLoader } from './threejs/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from "./threejs/examples/jsm/controls/OrbitControls.js";
import { TWEEN } from "./threejs/examples/jsm/libs/tween.module.min.js";

/*=============== Globals - Three JS ===============*/

// threejs app
const clock = new THREE.Clock();
let threeStuffs;
let spotLight;
let spotLightGroup;
let spotLightTarget;
let controls;
// threejs stats
let stats;
function createStats() {
	stats = new Stats();
	stats.setMode(0);
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';
	return stats;
}

/*=============== Globals - UI ===============*/

// UI states
let firstDetected = false;

// info
let info = document.getElementById('info');

/*=============== Globals - Animals ===============*/

// Animal Models
import animalModels from "./animal/animal.js";
let animalArray = [];

// Animal Action
let animalAction = "idle";

// Animal Position
let animalPosition = {
	x:0,
	y:0,
	z:-10
};
let animalSpeed = 0;
const animalSpeedMax = 20;
const animalSpeedPadding = 2;
const animalAcceleration = .4;
let animalDistance = 0;
let animalDirection = 1;

// Animal Rotation
const animalAngleSpeed = Math.PI/36;
const animalAnglePadding = Math.PI/12;
const animalAngleCenter = Math.PI/2;
let animalAngle = animalAngleCenter;
let animalAngleTarget = animalAngleCenter;

/*=============== Globals - Camera ===============*/

// Camera - steps
const stepsPerUnit = 100;
let camera;
let cameraTarget = {x:0, y:0}

// Camera speed
let cameraSpeed = {x:0,y:0};
const cameraSpeedMax = {x:36,y:8};
const cameraPadding = {x:2,y:2};
const cameraAcceleration = {x:6,y:1};
let cameraDistance = {x:0,y:0};
let cameraDirection = {x:1,y:1};

/*=============== Globals - WebSocket ===============*/

const socket = new WebSocket("wss://lifund-studio.com/movingWindow/webSocket/");
socket.addEventListener('message', function (event) {
	cameraTarget.x = parseInt(event.data.split(',')[0])/stepsPerUnit;
	cameraTarget.y = parseInt(event.data.split(',')[1])/stepsPerUnit;
});

/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/
/*=============== ThreeJS scene ===============*/

function init_contentsScene(spec,callback){

	/*=============== from jeeliz ===============*/

    spec.threeCanvasId = 'contentsCanvas'; // enable 2 canvas mode
    threeStuffs = JeelizThreeHelper.init(spec);

	/*=============== camera ===============*/

	camera = JeelizThreeHelper.create_camera(0.1,30);
	camera.position.z = 10; // 0 < z < 20, "contrals.panSpeed" should be considered
	camera.fov = 75;
	camera.updateProjectionMatrix();


	if(!exhibition){
		controls = new OrbitControls( camera, threeStuffs.renderer.domElement );
		controls.panSpeed = -2;

		controls.enableRotate = false;
		controls.screenSpacePanning = true;
		controls.mouseButtons = {
			LEFT: THREE.MOUSE.PAN,
			MIDDLE: THREE.MOUSE.DOLLY,
			// RIGHT: THREE.MOUSE.PAN
		}
		controls.touches = {
			ONE: THREE.TOUCH.PAN
		}
		var minPan = new THREE.Vector3( - 110, 0, 0 );
    var maxPan = new THREE.Vector3( 110, 0, 0 );
    var _v = new THREE.Vector3();

    controls.addEventListener("change", function() {
        _v.copy(controls.target);
        controls.target.clamp(minPan, maxPan);
        _v.sub(controls.target);
        camera.position.sub(_v);
    })

	}

	/*=============== renderer ===============*/
	
	threeStuffs.renderer.setPixelRatio( window.devicePixelRatio /2 );
	threeStuffs.renderer.setSize( window.innerWidth, window.innerHeight );
    
    threeStuffs.renderer.shadowMap.enabled = true;
	threeStuffs.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	threeStuffs.renderer.updateShadowMap.enabled = true; 

	threeStuffs.renderer.toneMapping = THREE.ReinhardToneMapping;
	threeStuffs.renderer.toneMappingExposure = 2.3;

	threeStuffs.renderer.localClippingEnabled = true;
	threeStuffs.renderer.alpha = true;
	threeStuffs.renderer.setClearColor(0x000000, 0.0);

	/*=============== Lights ===============*/

	// const ambientLight = new THREE.AmbientLight(0x9b8bc5,0.1);
	// threeStuffs.scene.add(ambientLight)

	spotLight = new THREE.SpotLight(0x9b8bc5,4);  //0xffa95c 0x3636FF 0x9b8bc5
	spotLight.castShadow = true;
	spotLight.angle = 1.05;
	spotLight.intensity = 2;
	spotLight.penumbra = 0.3;
	spotLight.decay = 2;
	spotLight.distance = 200;
	// spotLight.distance = 200;

	spotLight.shadow.bias = -0.0001;
	spotLight.shadow.mapSize.width = 512;//1024;
	spotLight.shadow.mapSize.height = 512;//1024;
	spotLight.shadow.aspect = 2;
	spotLight.shadow.focus = 1;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 40;
	spotLight.shadow.camera.fov = 20;
	
	spotLightGroup = new THREE.Object3D();
	spotLightTarget = new THREE.Object3D();

	// spotLightGroup.position.z = 0;
	spotLight.position.z = -5;
	spotLightTarget.position.z = 20;

	spotLightGroup.add(spotLight);
	spotLightGroup.add(spotLightTarget);
	spotLightGroup.translateZ(-20);;

	spotLight.target = spotLightTarget;
	threeStuffs.scene.add(spotLightGroup);
	// threeStuffs.scene.add(new THREE.SpotLightHelper(spotLight, 0xff0000))

	/*=============== portal ===============*/

	// const video = document.querySelector( 'video' );
	// const videoTexture = new THREE.VideoTexture( video );
	// videoTexture.wrapS = THREE.RepeatWrapping;
	// videoTexture.wrapT = THREE.RepeatWrapping;
	// videoTexture.offset = new THREE.Vector2(-0.2,1.2);
	// videoTexture.repeat.set( 1, 1 );

	// const portalGlass = new THREE.TextureLoader().load( "../public/texture/glass_0.jpg", function ( texture ) {
	// 	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	// 	texture.offset.set( 0, 0 );
	// 	texture.repeat.set( 2, 2 );
	// } );

	const portalTexture = new THREE.MeshPhongMaterial({  //MeshStandardMaterial({
		color:0x333333,
		specular: 0xffffff,
		shininess: 100,
		side: THREE.DoubleSide,
		roughness: 0,
		opacity: 0.25,
		// transparent: true

		// emissive: 0x000000, //0x999999
		// emissiveMap: portalGlass,
		// emissiveIntensity: 2,
		// roughness: 1,
	});

	// https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_shapes.html
	const outShape = new THREE.Shape()
		.moveTo( -5,-5 )
		.lineTo( -5,5 )
		.lineTo( 5,5 )
		.lineTo( 5,-5 )
		.moveTo( -5,-5 )
	const inShape = new THREE.Shape()
		.moveTo( -4,-4 )
		.lineTo( -4,4 )
		.lineTo( 4,4 )
		.lineTo( 4,-4 )
		.moveTo( -4,-4 )
	outShape.holes.push(inShape);
	const portalShapeGeometry = new THREE.ExtrudeGeometry( outShape, {
		steps: 1,
		depth: 10,
		bevelEnabled: true,
		bevelThickness: 1,
		bevelSize: 1,
		bevelOffset: 1,
		bevelSegments: 10
	});

	// RectAreaLightUniformsLib.init();

	const makePortal = (portalPosition) => {

		// const rectLightLeft = new THREE.RectAreaLight( 0xffffff, 4, 10, 20 );
		// const rectLightRight = new THREE.RectAreaLight( 0xffffff, 4, 10, 20 );
		// rectLightLeft.rotateY(-Math.PI/2);
		// rectLightRight.rotateY(Math.PI/2);
		// rectLightLeft.position.setX(portalPosition);
		// rectLightRight.position.setX(portalPosition);
		// threeStuffs.scene.add( rectLightLeft );
		// threeStuffs.scene.add( rectLightRight );

		const portalHollow = new THREE.Mesh( portalShapeGeometry, portalTexture );

		portalHollow.position.setX(portalPosition-2.5);
		portalHollow.position.setZ(animalPosition.z);
		portalHollow.rotation.y = Math.PI/2;
		portalHollow.scale.z *= 0.5;
		portalHollow.castShadow = true;
		threeStuffs.scene.add(portalHollow);
	}

	[-80,-48,-16,16,48,80].forEach(portalPosition=>{
		makePortal(portalPosition);
	})
	
	/*=============== Room ===============*/

	const textureNumber = 3;
	const textureRepeat = 4;

	// const roomTexture = new THREE.TextureLoader().load( "../public/texture/ceiling_"+textureNumber+".jpg", function ( texture ) {
	// 	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	// 	texture.offset.set( 0, 0 );
	// 	texture.repeat.set( 6*textureRepeat, textureRepeat );
	// } );
	// const roomTextureNormal = new THREE.TextureLoader().load( "../public/texture/ceiling_"+textureNumber+"_normal.png", function(texture){
	// 	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	// 	texture.offset.set( 0, 0 );
	// 	texture.repeat.set( 6*textureRepeat, textureRepeat );
	// });
	const roomMaterial = new THREE.MeshPhongMaterial({ 
		// map: roomTexture,
		// normalMap: roomTextureNormal,
		// emissive: 0x333333,
		color: 0x555555,
		side: THREE.BackSide,
		specular: 0xffffff,
		shininess: 30,
		roughness: 0.5
	});
	const transparent = new THREE.MeshBasicMaterial({
		opacity: 0
	})
	const roomGeometry = new THREE.BoxBufferGeometry(240,10,50,1,1,1);

	const room = new THREE.Mesh(roomGeometry, [
		roomMaterial,roomMaterial,roomMaterial,roomMaterial,transparent,transparent
	]);
	room.material.transparent = true;
	room.receiveShadow = true;
	room.matrixAutoUpdate = false;
    threeStuffs.scene.add(room)	

	/*=============== Stats ===============*/

	if(development){
		stats = createStats();
		document.body.appendChild( stats.domElement );
	}
	/*=============== Canvas Initiation Callback ===============*/
	
	callback();

	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
	/*=============== Animation ===============*/
    
    const animate = function (){
		const delta = clock.getDelta();

		/*=============== move Camera ===============*/

		cameraDistance.x = Math.abs(cameraTarget.x - camera.position.x);
		cameraDistance.y = Math.abs(cameraTarget.y - camera.position.y);
		cameraDirection.x = (cameraTarget.x - camera.position.x) > 0 ? 1 : -1;
		cameraDirection.y = (cameraTarget.y - camera.position.y) > 0 ? 1 : -1;

		if(cameraDistance.x >= cameraPadding.x) {

			// 최고속도 이하이면 가속
			if(Math.abs(cameraSpeed.x) < cameraSpeedMax.x) {
				cameraSpeed.x += cameraAcceleration.x * cameraDirection.x;
			}
			// 최고속도 유지
			else {
				cameraSpeed.x = cameraSpeedMax.x * cameraDirection.x;
			}

		} else {
			if(Math.abs(cameraSpeed.x)>0.5) {
				cameraSpeed.x -= cameraSpeed.x / cameraPadding.x ;
			} else {
				cameraSpeed.x = 0;
			}
		}

		if(exhibition) {
			camera.position.x += cameraSpeed.x * delta;
		}

		/*=============== move Spotlight ===============*/

		spotLightGroup.position.x = camera.position.x;
		spotLightGroup.position.y = camera.position.y;

		/*=============== move Animal ===============*/

		// animal fully initiated ?
		if (animalArray.length === Object.keys(animalModels).length){

			// values calculated every time
			animalDistance = Math.abs(camera.position.x - animalPosition.x);
			animalDirection = (camera.position.x - animalPosition.x) > 0 ? 1 : -1;
			const animalAngleFromCenter = Math.abs(animalAngleTarget - animalAngle);

			/*=============== Animal Rotation ===============*/

			if ( Math.abs(animalSpeed) >= 1 ) // if animal is moving, see moving direction
			{
				if( animalSpeed >= 1 ){ // this is left
					animalAngleTarget = 0;
					if(animalAngleFromCenter > animalAnglePadding)
						animalAngle -= animalAngleSpeed;
				}
				if(animalSpeed <= -1){ // this is right
					animalAngleTarget = Math.PI;
					if(animalAngleFromCenter > animalAnglePadding)
						animalAngle += animalAngleSpeed;
				}
			} 
			if (Math.abs(animalSpeed) == 0) { // if animal is not moving, see front
				animalAngleTarget = animalAngleCenter;
				if(animalAngleFromCenter > animalAnglePadding){
					if(animalAngle > animalAngleCenter) animalAngle -= animalAngleSpeed;
					if(animalAngle < animalAngleCenter) animalAngle += animalAngleSpeed;
				}
			}
	
			/*=============== Animal Action ===============*/

			if ( Math.abs(animalSpeed) > animalSpeedMax / 2){
				animalAction = 'run';
			} else {
				if( Math.abs(animalSpeed) > .5 || animalAngleFromCenter > animalAnglePadding){
					animalAction = 'walk';
				} else {
					animalAction = 'idle';
				}
			}

			/*=============== Animal Position ===============*/

			if(animalDistance > animalSpeedPadding) {

				// 최고속도 이하이면 가속
				if(Math.abs(animalSpeed) < animalSpeedMax) {
					animalSpeed += animalAcceleration * animalDirection;
				}
				// 최고속도 유지
				else {
					animalSpeed = animalSpeedMax * animalDirection;
				}
	
			} else {
				if(Math.abs(animalSpeed)>0.25) {
					animalSpeed -= animalSpeed / animalSpeedPadding ;
				}
				else {
					animalSpeed = 0;
				}
			}
			animalPosition.x += animalSpeed * delta

			/*=============== Actual Animal Object Updates ===============*/

			animalArray.forEach(animal=>{

				animal.setAction(animal.animationActions[animalAction])
				animal.mixer.update(delta);
				animal.modelObject.position.x = animalPosition.x;
				animal.modelObject.rotation.y = animalAngle;
				
			})
		}

        // console.log(threeStuffs.renderer.info.render.calls);
		if(development){
			info.innerHTML = `
			Stat : <br>
			cameraTarget : ${cameraTarget.x}<br>
			cameraSpeed : ${cameraSpeed.x}<br>
			cameraDirection : ${cameraDirection.x}<br>
			cameraPosition :  ${camera.position.x}<br>
			cameraDistance : ${Math.trunc(cameraTarget.x - camera.position.x)}<br>
			<br>
			animalPosition : ${animalPosition.x}<br>
			animalSpeed : ${animalSpeed}<br>
			animalDirection : ${animalDirection}<br>
			animalDistance : ${animalDistance}<br>
			`;
		}


		/*=============== RAF, Orbit ===============*/
		if(!exhibition) {
			controls.update();
		}
		requestAnimationFrame(animate);
		if(development) stats.update();
    }

    animate();
}

/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/
/*=============== Animal Class ===============*/

class Animal {
	constructor(animalName=""){
		this.animalName = animalName;
		this.modelObject;
		this.modelReady = false;

		this.mixer;
		this.animationActions = {};
		this.activeAction;
		this.lastAction;

		this.opacity = 1;

		this.added = false;
		this.enabled = false;
	}
	loadModel(){
		const gltfLoader = new GLTFLoader();
		gltfLoader.load(
			animalModels[this.animalName].gltfFilePath,
			(gltf) => {

				this.modelObject = gltf.scene
				
				this.modelObject.children[0].rotation.x = animalModels[this.animalName].orientation.x;
				this.modelObject.children[0].rotation.y = animalModels[this.animalName].orientation.y;
				this.modelObject.children[0].rotation.z = animalModels[this.animalName].orientation.z;


				this.mixer = new THREE.AnimationMixer(gltf.scene);
				this.animationActions["idle"] = this.mixer.clipAction(gltf.animations[0]);
				this.animationActions["walk"] = this.mixer.clipAction(gltf.animations[2]);
				this.animationActions["run"] = this.mixer.clipAction(gltf.animations[1]);
				this.activeAction = this.animationActions["idle"];
				this.activeAction.play();

				this.modelObject.scale.setX(animalModels[this.animalName].scale).setY(animalModels[this.animalName].scale).setZ(animalModels[this.animalName].scale);
				this.modelObject.position.setX(animalPosition.x).setY(animalModels[this.animalName].y).setZ(animalPosition.z);
				this.modelObject.children[0].traverse(n => { 
					if ( n.isMesh ) {
						n.castShadow = true; 
						if(n.material.map) n.material.map.anisotropy = 1;
						/*=============== Separator ===============*/
					}
					if ( n.type == "SkinnedMesh" ){
						// n.material.transparent = true;
						// n.material.opacity = this.opacity;
						// n.material.shadowSide = THREE.DoubleSide;
						// https://stackoverflow.com/questions/36557486/three-js-object-clipping
						n.material.clippingPlanes = [
							new THREE.Plane( new THREE.Vector3( animalModels[this.animalName].clippingLeft.direction, 0, 0 ), animalModels[this.animalName].clippingLeft.position ),
							new THREE.Plane( new THREE.Vector3( animalModels[this.animalName].clippingRight.direction, 0, 0 ), animalModels[this.animalName].clippingRight.position )
						];
						// n.material.skinning = true
						n.material.clipShadows = true;
						n.material.clipIntersection = false;
					}
				});
				this.modelObject.rotation.y = animalAngle;
				this.modelReady = true
				
				animalLoadedCallback();
			},
			(onload) => {
				console.log((onload.loaded / onload.total * 100) + '% loaded')
			},
			(error) => {
				console.log(error);
			}
		)
	}
	setAction(toAction){
		if (toAction != this.activeAction) {
			this.lastAction = this.activeAction
			this.activeAction = toAction
			// lastAction.stop()
			this.lastAction.fadeOut(1)
			this.activeAction.reset()
			this.activeAction.fadeIn(1)
			this.activeAction.play()
		}
	}
	add(){
		threeStuffs.scene.add(this.modelObject)
		this.added = true;

		// threeStuffs.scene.add(new THREE.PlaneHelper( new THREE.Plane( new THREE.Vector3( animalModels[this.animalName].clippingLeft.direction, 0, 0 ), animalModels[this.animalName].clippingLeft.position ), 10, animalModels[this.animalName].clippingColor))
		// threeStuffs.scene.add(new THREE.PlaneHelper( new THREE.Plane( new THREE.Vector3( animalModels[this.animalName].clippingRight.direction, 0, 0 ), animalModels[this.animalName].clippingRight.position ), 10, animalModels[this.animalName].clippingColor))
	}
	disable(){
		this.modelObject.visible = false;
		this.enabled = false;
	}
	enable(){
		this.modelObject.visible = true;
		this.enabled = true;
	}
}

/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/
/*=============== face-fliter ===============*/

let sendLost = true;
function init_faceFilter(bestVideoSettings,callback){

	let CVD = null; // return of Canvas2DDisplay

	const SETTINGS = {
		videoSettings: bestVideoSettings,
		strokeStyle: 'yellow',
		detectionThreshold: 0.50, // sensibility, between 0 and 1. Less -> more sensitive
		detectionHysteresis: 0.05,
	};
	let ISDETECTED = false;


	
	JEELIZFACEFILTER.init({
		
		canvasId: 'jeeFaceFilterCanvas',
		NNCPath: '../public/jeelizFaceFilter/neuralNets/NN_VERYLIGHT_0.json',
    	//  NN_DEFAULT  NN_WIDEANGLES_0  NN_INTEL1536  NN_4EXPR_0  NN_VERYLIGHT_0
		maxFacesDetected: 1,
	
		callbackReady: function(errCode, spec){ // called once
			
			if (errCode === "WEBCAM_UNAVAILABLE"){ window.alert("You need webcam to play. Please use your mobile phone. \n 재생을 위해서는 카메라가 필요합니다. 모바일에서 접속해주세요.") ; console.error(errCode); return; }
			console.log('INFO: JEELIZFACEFILTER IS READY');

            // JEELIZFACEFILTER.set_scanSettings({
            //     "scale0Factor": 0.5,
            //     "nScaleLevels": 2,
            //     "overlapFactors": [2,2,3],
            //     "nDetectsPerLoop": -1
            // });
            // JEELIZFACEFILTER.toggle_slow = true;
			
			// draw face rect
			CVD = JeelizCanvas2DHelper(spec);
			CVD.ctx.strokeStyle = SETTINGS.strokeStyle;
            init_contentsScene(spec,callback);

		},
		
		callbackTrack: function(detectState){ // called at each render iteration (drawing loop)

			// Detect State
			if (ISDETECTED && detectState.detected<SETTINGS.detectionThreshold-SETTINGS.detectionHysteresis){
				ISDETECTED = false;
			} else if (!ISDETECTED && detectState.detected>SETTINGS.detectionThreshold+SETTINGS.detectionHysteresis){
				ISDETECTED = true;
			}
			if (ISDETECTED){

				/*=============== on detection ===============*/
				/*=============== on detection ===============*/
				/*=============== on detection ===============*/

				// UI DOM 
				if(firstDetected === false){
					firstDetected = true;
					firstDetectedCallback();
				}

				// Animate (TWEEN) with face
				new TWEEN.Tween(spotLightGroup.rotation)
				.to({
					x: detectState.rx*Math.PI * 0.5,
					y: detectState.ry*Math.PI,
					z: 0
				}, 100)
				.start();
				spotLight.updateMatrix();
				spotLight.updateMatrixWorld();

				// draw 2d canvas
				// const faceCoo = CVD.getCoordinates(detectState);
				CVD.ctx.clearRect(0, 0, CVD.canvas.width, CVD.canvas.height);
				// CVD.ctx.strokeRect(faceCoo.x, faceCoo.y, faceCoo.w, faceCoo.h);
				CVD.update_canvasTexture(); 
				
				// send coordinates
				if(exhibition){
					if(socket.readyState==1){
						socket.send(JSON.stringify({
							"detected": true,
							"x": detectState.x,
							"y": detectState.y + detectState.s // eye height
						}));
					}
					// should sent lost next time
					sendLost = true;
				}
				// UI lost show me : disable
				setUiState(uiStateComponents.following);

			} else {
				// UI lost show me : set
				setUiState(uiStateComponents.lost);

				// send lost state
				if(exhibition){
					if(socket.readyState==1 && sendLost){
						socket.send(JSON.stringify({
							"detected":false
						}));
						sendLost = false;
					}
				}
			}

			// 2D Canvas
			CVD.draw();
            JeelizThreeHelper.render(detectState,camera)
			
			// TWEEN Call
			TWEEN.update();
		}
	});	
}

/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/
/*========== DOM ==========*/

// State's Components
const uiStateComponents = {
	'landing': [
		'landing',
	],
	'searchFace': [
		'canvasOverlay',
		'loading'
	],
	'following': [
		'moreAboutQuote',
		'back'	
	],
	'lost': [
		'loading',
		'back'
	],
	'qr': [
		'qrModal',
		'qrOverlay'
	]
}

// STATES 
let prevUiState = null;
let currentUiState = uiStateComponents.landing;

// UI State Setter
let setUiState = function(newState){
	if(currentUiState !== newState){

		prevUiState = currentUiState;
		currentUiState = newState;
		console.log('uiState has set to :',newState);

		switch (newState) {
			case uiStateComponents.landing:
				document.body.style.overflow = 'initial';
			case uiStateComponents.searchFace:
				document.body.style.overflow = 'hidden';
			case currentUiState:
				if(prevUiState) {
					prevUiState.forEach((el)=>{
						toggleOpacity(el,'off');
					})
				}
				currentUiState.forEach((el)=>{
					toggleOpacity(el,'on');
				})
		}
	}
}

/*========== UI - On Document Load ==========*/

// pre-load model
for (const animalName in animalModels) {
	const animal = new Animal(animalName)
	animal.loadModel();
	animalArray.push( animal );
}

/*========== UI - Scroll Animation ==========*/

let scrollStopCallback = function (params) {};
window.addEventListener('scroll',()=> {
	const distanceFromPageTop = document.body.scrollTop || document.documentElement.scrollTop;
	const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	const scrolled = (distanceFromPageTop / height) * 100;
	if(scrollStopCallback) window.clearTimeout( scrollStopCallback );
	scrollStopCallback = setTimeout(function() {}, 100);
	// console.log(distanceFromPageTop);
})

/*========== Start Button => Canvas Init ==========*/

const canvasInit = function (callback) {
	JeelizResizer.size_canvas({
		canvasId: 'jeeFaceFilterCanvas',
		  	callback: function(isError, bestVideoSettings){
			  	init_faceFilter(bestVideoSettings,callback)
		  	}
	});
}
const canvasInitCallback = function () {
	setUiState(uiStateComponents.searchFace);
	animalArray.forEach((animal)=>{
		animal.add();
	})
}
document.getElementById('startButton').addEventListener('click',(ev)=>{
	// document.getElementById('bgm').play();
    canvasInit( canvasInitCallback );
});

/*========== Canvas Init => animal sequence ==========*/

const firstDetectedCallback = function(){
	// setTimeout(() => {
	setUiState(uiStateComponents.following);
	// }, 1000);
}
const animalLoadedCallback = function(){
	if(animalArray.length == Object.keys(animalModels).length){
		console.log('Animal loading ok. (',animalArray.length,')');
	}
}

/*========== QR codes ==========*/

if(document.getElementById('qrOpen')){
	document.getElementById('qrOpen').addEventListener('click',()=>{
		setQrCode('https://lifund-studio.com/home');
		setUiState(uiStateComponents.qr);
	});
	document.getElementById('qrClose').addEventListener('click',()=>{
		setUiState(uiStateComponents.landing);
	});
}
function setQrCode(url=""){
	const QRC = qrcodegen.QrCode;
	const qr0 = QRC.encodeText(url, QRC.Ecc.MEDIUM);
	const qrSvg = qr0.toSvgString(4);
	
	const qrBlob = new Blob([qrSvg], {type: 'image/svg+xml'});
	const qrUrl = URL.createObjectURL(qrBlob);
	const qrImage = document.getElementById('qrImage');
	qrImage.src = qrUrl;
	qrImage.addEventListener('load', () => URL.revokeObjectURL(qrUrl), {once: true});
}

/*========== back to home ==========*/

document.getElementById('back').addEventListener('click',()=>{
	window.location = window.location;
});

/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/
/*========== Helpers ==========*/

const toggleOpacity = function (domId,state) {
	const dom = document.getElementById(domId);
	if(state === 'on' && !dom.classList.contains('opacityOn')){
		dom.classList.remove('opacityOff');
		dom.classList.add('opacityOn');
	}
	if(state === 'off' && !dom.classList.contains('opacityOff')){
		dom.classList.remove('opacityOn');
		dom.classList.add('opacityOff');
	}
}

function getAnimalNameRandom() {
	const animalNames = Object.keys(animalModels);
	const index = Math.round(Math.random() * (animalNames.length-1));
	return animalNames[index];
}

function animateRotation (object3D) {
	new TWEEN.Tween(object3D.rotation.x)
	  .to({ opacity: 1 }, 1000)
	  .start();
	new TWEEN.Tween(object3D.material[2])
	  .to({ opacity: 1 }, 1000)
	  .start();
	new TWEEN.Tween(object3D.material[0])
	  .to({ opacity: 1 }, 1000)
	  .start();
}
