import '../styles/style.css';

import Banner from '../components/Banner';
import Form from '../components/Form';

function Home() {
  return (
    <>
      <Banner />
      <Form title="Connexion" btnText="Se connecter" />
    </>
  );
}

export default Home;
