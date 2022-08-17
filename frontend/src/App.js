import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Forum from './pages/Forum';
import Contact from './pages/Contact';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
