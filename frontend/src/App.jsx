import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Splash from './pages/Splash';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import Venda from './pages/Venda';
import Caixa from './pages/Caixa';
import Cliente from './pages/Cliente';
import NotaFiscal from './pages/NotaFiscal';
import Pagamento from './pages/Pagamento';
import EntradaMercadoria from './pages/EntradaMercadoria';
import ExcecaoImposto from './pages/ExcecaoImposto';
import Perfil from './pages/Perfil';
import MeiosPagamento from './pages/MeiosPagamento';
import Produtos from './pages/Produtos';
import Estoque from './pages/Estoque';
import FAQ from './pages/FAQ';
import Sobre from './pages/Sobre';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/splash"
            element={isAuthenticated ? <Splash /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          >
            <Route index element={<DashboardHome />} />
            <Route path="venda" element={<Venda />} />
            <Route path="caixa" element={<Caixa />} />
            <Route path="cliente" element={<Cliente />} />
            <Route path="produtos" element={<Produtos />} />
            <Route path="notafiscal" element={<NotaFiscal />} />
            <Route path="pagamento" element={<Pagamento />} />
            <Route path="entrada-mercadoria" element={<EntradaMercadoria />} />
            <Route path="excecao-imposto" element={<ExcecaoImposto />} />
            <Route path="meios-pagamento" element={<MeiosPagamento />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="sobre" element={<Sobre />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
