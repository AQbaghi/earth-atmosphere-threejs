import './style.css'

import * as THREE from 'three'; 
import gsap from 'gsap'
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl'

import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'
import { Float32BufferAttribute } from 'three';

const canvasContainer = document.querySelector('#canvas-container')

// createing scene, camera, and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75, 
  canvasContainer.offsetWidth/canvasContainer.offsetHeight, 
  0.1, 
  1000
)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector('canvas')
})

//setting size of canvas, and pixel ratio and appending three to dom
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
renderer.setPixelRatio(devicePixelRatio)




//create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  // new THREE.MeshBasicMaterial({
  //   map: new THREE.TextureLoader().load('./images/earth-uv-map.jpg')
  // })
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./images/earth-uv-map.jpg')
      }
    }
  })
)

//atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
)

//making the atmosphere bigger than earth
atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xFFFFFF
})
const starVerticies = []
for(let i = 0; i < 10000; i++){
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -Math.random() * 12000
  starVerticies.push(x, y, z)
}
starGeometry.setAttribute('position', new Float32BufferAttribute(starVerticies, 3))

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

camera.position.z = 15

const mouse = {
  x: null,
  y: null
}

//animation
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  sphere.rotation.y += 0.003
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * .3,
    duration: 2
  })
}
animate()

//event listener for mouce movement
addEventListener('mousemove', ()=>{
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = (event.clientY / innerHeight) * 2 - 1
})

//resize screen
window.addEventListener('resize', ()=>{
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)
  camera.aspect = canvasContainer.offsetWidth/canvasContainer.offsetHeight
  camera.updateProjectionMatrix()
})

//starting the render
renderer.render(scene, camera)


