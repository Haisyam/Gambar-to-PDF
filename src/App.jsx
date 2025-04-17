import Particles from "./Reactbits/Particles";
import "./App.css";
import Card from "./Components/Card";

function App() {
  return (
    <>
      <div className="relative w-full min-h-screen">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
        <Card className="absolute"></Card>
      </div>
    </>
  );
}

export default App;
