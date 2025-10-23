import { AuthProvider } from './components/context/AuthContext';
import Layout from './components/layout/layout'

function App() {

  return (
   <AuthProvider>
    <Layout/>
    
    </AuthProvider>
  );
}

export default App
