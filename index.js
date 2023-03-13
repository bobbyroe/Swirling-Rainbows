import * as THREE from "three";
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

async function main () {
  const vsh = await fetch("./vert.glsl");
  const fsh = await fetch("./frag.glsl");

  const uniforms = {
    time: { value: 0.0 }
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: await vsh.text(),
    fragmentShader: await fsh.text()
  });

  function getBall({ pos, index }) {
    const size = 0.25;
    const geo = new THREE.IcosahedronGeometry(size, 4);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = pos.x;
    mesh.position.y = pos.y;
    const offset = (index * 0.001) % 0.05;
    function update () {
      mesh.rotation.x += 0.01 + offset;
      mesh.rotation.y += 0.005 + offset;
    }
    return { mesh, update };
  }
  const gridSize = 10;
  const balls = [];
  let ball = {};
  const startPos = {
    x: -2.5,
    y: -2.5
  };
  const gap = 0.55;
  for (let x = 0; x < gridSize; x += 1) {
    for (let y = 0; y < gridSize; y += 1) {
      let pos = {x: startPos.x + x * gap, y: startPos.y + y * gap};
      ball = getBall({ pos, index: x + y});
      scene.add(ball.mesh);
      balls.push(ball);
    }
  }

  function animate(t) {
    t *= 0.001;
    requestAnimationFrame(animate);
    balls.forEach( b => b.update());
    uniforms.time.value = t;
    renderer.render(scene, camera);
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