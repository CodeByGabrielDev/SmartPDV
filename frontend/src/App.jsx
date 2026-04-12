import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Venda from './pages/Venda';
import Caixa from './pages/Caixa';
import Cliente from './pages/Cliente';
import NotaFiscal from './pages/NotaFiscal';
import Pagamento from './pages/Pagamento';
import EntradaMercadoria from './pages/EntradaMercadoria';
import ExcecaoImposto from './pages/ExcecaoImposto';
import Perfil from './pages/Perfil';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        >
          <Route path="venda" element={<Venda />} />
          <Route path="caixa" element={<Caixa />} />
          <Route path="cliente" element={<Cliente />} />
          <Route path="notafiscal" element={<NotaFiscal />} />
          <Route path="pagamento" element={<Pagamento />} />
          <Route path="entrada-mercadoria" element={<EntradaMercadoria />} />
          <Route path="excecao-imposto" element={<ExcecaoImposto />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;