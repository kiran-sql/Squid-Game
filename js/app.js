const text = document.querySelector('.text');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor(0xb7c3f3, 1); //for background color 1-represents opacity of the bg color

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light ); //bina light ke 3d object screen pe nhi dikhega isliye add kiya

//global variables
const start_position = 3;
const end_position = -start_position;
const TIME_LIMIT = 15;
let gameStat = "loading";
let isLookingBackward = true;

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '../music/music_bg.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

function createCube(size,position,rotX = 0,color=0xfbc2c4){
    const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
    const material = new THREE.MeshBasicMaterial( { color: color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = position;
    cube.rotation.y = rotX;
    scene.add( cube );
    return cube;
}

async function delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

const bgMusic = new Audio('../music/bg.mp3')
bgMusic.loop = true

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
       gsap.to(this.doll.rotation,{y: -3.13, duration: 0.5});
       setTimeout(() => isLookingBackward = true, 200);
    }

    lookForward(){
        //this.doll.rotation.y = 0;
        gsap.to(this.doll.rotation,{y: 0, duration: 0.5});
        setTimeout(() => isLookingBackward = false, 500);
    }

    async start(){
        this.lookBackward();
        await delay(Math.random() * 2000);
        this.lookForward();
        await delay(Math.random() * 10000);
        this.start();
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

    stop(){
        //this.playerInfo.velocity = 0;
        gsap.to(this.playerInfo, {velocity: 0, duration: 0.5});
    }

    check(){
        if(!isLookingBackward && this.playerInfo.velocity>0){
            //alert("You Lost");
            gameStat = "over";
            text.innerText = "You Lost...."
        }
        if(this.playerInfo.positionX < end_position + 0.4){
            //alert("You Won...!!!!");
            gameStat = "over";
            text.innerText = "Yayy You Win...!!!";
        }
    }

    update(){
        this.check();
        this.playerInfo.positionX -= this.playerInfo.velocity;
        this.player.position.x = this.playerInfo.positionX;
    }
}

function createTrack(){
    createCube({w:start_position*2 + 0.2, h:1.5, d:1},0 , 0, 0xf78589).position.z = -1;
    createCube({w:0.2, h:1.5 ,d:1},start_position, -0.2);
    createCube({w:0.2, h:1.5 ,d:1},end_position, 0.2);
    
}

createTrack();

let doll = new Doll();
let player = new Player();

async function init(){
    await delay(1000);
    text.innerText = 'Starting in 3';
    await delay(1000);
    text.innerText = 'Starting in 2';
    await delay(1000);
    text.innerText = 'Starting in 1';
    await delay(1000);
    text.innerText = 'Start....!!!!';
    startGame();
}

function startGame(){
    gameStat = "start";
    let progressbar = createCube({w: 6, h: .33, d: 0}, 1.-1);
    progressbar.position.y = 3.54;
    gsap.to(progressbar.scale,{x: 0, duration: TIME_LIMIT, ease: "none"});
    doll.start();
    setTimeout(() =>{ 
    if(gameStat != "over"){
        text.innerText = "You ran out of time.";
        gameStat = "over";
    }
    }, TIME_LIMIT*1000)
}


init();

function animate() {
    if(gameStat == "over") return;
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

//arrow up ki pe chalega
window.addEventListener("keydown",(e) => {
   // alert(e.key);
   if(gameStat !="start") return;
   if(e.key == 'ArrowDown'){
    player.run();
   }
});

//arrow up ki choda to ruk jaayega
window.addEventListener("keyup",(e) => {
   // alert(e.key);
    if(e.key == 'ArrowDown'){
        player.stop();
    }
});  