import logo from '../logo.svg';
import '../styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Rejoignez la communauté Groupomania !!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Je me connectes
        </a>
      </header>
    </div>
  );
}

export default App;
