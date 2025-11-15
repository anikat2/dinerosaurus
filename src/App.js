import './App.css';
import powerUpsBack from './powerUpsBack';
import ParentComponent from './parentComponent';
import AsteroidGame from "./AsteroidGame";
import Portfolio from "./Portfolio";


function App() {
  return (
    <div className="App">
     <powerUpsBack />
     <ParentComponent />
      <AsteroidGame />
      <Portfolio />

    </div>
  );
}

export default App;
