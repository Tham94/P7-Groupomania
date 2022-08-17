import '../styles/style.css';

import Banner from '../components/Banner';
import Form from '../components/Form';

function SignUp() {
  return (
    <>
      <Banner />
      <Form title="Rejoindre la communauté" btnText="S'enregistrer" />
    </>
  );
}

export default SignUp;
