const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0xb7c3f3,1); //for background color 1-represents opacity of the bg color

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );
//bina light ke 3d object screen pe nhi dikhega isliye add kiya

//global variables
const start_position = 3;
const end_position = -start_position;

function createCube(size,position,rotX = 0,color=0xfbc2c4){
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = position;
    cube.rotation.y = rotX;
    scene.add( cube );
    return cube;
}

camera.position.z = 5;

var loader = new THREE.GLTFLoader(); //loads a 3d model

class Doll{
    constructor(){
        loader.load("../models/scene.gltf",(gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.4,0.4,0.4);
            gltf.scene.position.set(0,-1,0);
            this.doll = gltf.scene;
        }, 
        undefined, function ( error ) {
            console.error( error );
        });
    }

    lookBackward(){
       // this.doll.rotation.y = -3.13;
       gsap.to(this.doll.rotation,{y: -3.13, duration: 1});
    }

    lookForward(){
        //this.doll.rotation.y = 0;
        gsap.to(this.doll.rotation,{y: 0, duration: 1});
    }
}

class Player{
    constructor(){
    const geometry = new THREE.SphereGeometry( 0.4, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = start_position + 1;
    scene.add( sphere );
    this.player = sphere;
    this.playerInfo = {
        positionX:start_position,
        velocity:0, //kis speed se badega
    }
    }

    run(){
        this.playerInfo.velocity = 0.02;
    }

    update(){
        this.playerInfo.positionX -=this.playerInfo.velocity;
        this.player.position.x = this.playerInfo.positionX;
    }
}

function createTrack(){
    createCube({w:start_position*2 + 0.2, h:1.5, d:1},0 , 0, 0xf78589).position.z = -1;
    createCube({w:0.2, h:1.5 ,d:1},start_position, -0.2);
    createCube({w:0.2, h:1.5 ,d:1},end_position, 0.2);
    
}

createTrack();

//let doll = new Doll();
let player = new Player();

setTimeout(() => {
    doll.lookBackward();
}, 1000);

setTimeout(() => {
    doll.lookForward();
}, 5000);

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
    player.update();
}
animate();

window.addEventListener("resize",onWindowResize,false);
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener("keydown",(e) => {
   // alert(e.key);
    player.run();
});