import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

async function main () {
  const vsh = await fetch("./vert.glsl");
  const fsh = await fetch("./frag.glsl");

  const uniforms = {
    time: { value: 0.0 },
    resolution: { value: new THREE.Vector2( w, h )},
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: await vsh.text(),
    fragmentShader: await fsh.text()
  });

  function getBall({ pos, index }) {
    const size = 0.25;
    const geo = new THREE.IcosahedronGeometry(size, 8);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    function update () {
      // mesh.rotation.x += 0.01 + offset;
      // mesh.rotation.y += 0.005 + offset;
    }
    return { mesh, update };
  }
  
  // icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(2.5, 3);


  const balls = [];
  let ball = {};

  const pos = icoGeo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0, len = pos.count; i < len; i += 1) {
    p.fromBufferAttribute(pos, i);
    ball = getBall({ pos: p.clone(), index: i});
    scene.add(ball.mesh);
    balls.push(ball);
    
  }

  function animate(t) {
    t *= 0.001;
    requestAnimationFrame(animate);
    balls.forEach( b => b.update());
    uniforms.time.value = t;
    uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height);
    renderer.render(scene, camera);
    ctrls.update();
  }
  animate(0);
}
main();
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);