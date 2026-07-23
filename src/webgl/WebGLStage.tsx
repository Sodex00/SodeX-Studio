import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  WebGLRenderer,
  WireframeGeometry,
} from "three";

export function WebGLStage() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new Scene();
    scene.fog = null;

    const camera = new PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#070507", 1);
    mount.appendChild(renderer.domElement);

    const coreGeometry = new IcosahedronGeometry(1.65, 3);
    const core = new Mesh(
      coreGeometry,
      new MeshBasicMaterial({
        color: new Color("#ff174d"),
        wireframe: true,
        transparent: true,
        opacity: 0.42,
      }),
    );
    core.position.set(1.55, 0.35, 0);
    scene.add(core);

    const shell = new LineSegments(
      new WireframeGeometry(new IcosahedronGeometry(2.42, 2)),
      new LineBasicMaterial({
        color: "#7b1027",
        transparent: true,
        opacity: 0.62,
      }),
    );
    shell.position.copy(core.position);
    scene.add(shell);

    const particleCount = 900;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let index = 0; index < particleCount; index += 1) {
      const radius = 4 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
      speeds[index] = 0.45 + Math.random() * 1.8;
    }

    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    const particles = new Points(
      particleGeometry,
      new PointsMaterial({
        color: "#ff2a5f",
        size: 0.026,
        transparent: true,
        opacity: 0.72,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    scene.add(particles);

    const pointer = new Vector2(0, 0);
    const handlePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * -2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("resize", handleResize);

    let frame = 0;
    let animationId = 0;
    const animate = () => {
      frame += 0.008;
      core.rotation.x = frame * 0.72 + pointer.y * 0.18;
      core.rotation.y = frame * 1.15 + pointer.x * 0.24;
      shell.rotation.x = -frame * 0.38 + pointer.y * 0.08;
      shell.rotation.z = frame * 0.44 + pointer.x * 0.08;
      particles.rotation.y = frame * 0.12;
      particles.rotation.x = Math.sin(frame * 0.8) * 0.08;
      particles.position.x = pointer.x * 0.18;
      particles.position.y = pointer.y * 0.12;

      const positionAttribute = particleGeometry.getAttribute("position") as BufferAttribute;
      for (let index = 0; index < particleCount; index += 1) {
        const yIndex = index * 3 + 1;
        positionAttribute.array[yIndex] += Math.sin(frame * speeds[index] + index) * 0.0008;
      }
      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      coreGeometry.dispose();
      core.material.dispose();
      shell.geometry.dispose();
      shell.material.dispose();
      particleGeometry.dispose();
      particles.material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="webgl-stage" ref={mountRef} aria-hidden="true" />;
}
