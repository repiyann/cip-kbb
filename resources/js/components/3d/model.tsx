import { OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, TextureLoader } from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

function Model() {
    const obj = useLoader(OBJLoader, '/model.obj');
    const texture = useLoader(TextureLoader, '/tex/rp_mei_posed_001_dif_8k.jpg');
    const normalMap = useLoader(TextureLoader, '/tex/rp_mei_posed_001_norm_8k.jpg');

    obj.traverse((child) => {
        if ((child as Mesh).isMesh) {
            (child as Mesh).material = new MeshStandardMaterial({
                map: texture,
                normalMap: normalMap,
            });
        }
    });

    return <primitive object={obj} scale={0.15} position={[0, -10, 0]} />;
}

export default function ModelComponent() {
    return (
        <Canvas camera={{ position: [0, 10, 25] }}>
            <ambientLight intensity={1} />
            <directionalLight position={[2, 2, 2]} />
            <Model />
            <OrbitControls />
        </Canvas>
    );
}
