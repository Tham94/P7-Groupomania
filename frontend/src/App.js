import './styles/style.css';

import Header from './components/Header';
import Banner from './components/Banner';
import Form from './components/LoginForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Banner />
      <Form />
      <Footer />
    </div>
  );
}

export default App;
