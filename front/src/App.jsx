import ClienteForm from './components/ClienteForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>SmartPDV - Gestão de Vendas</h1>
      </header>
      <main className="app-main">
        <ClienteForm />
      </main>
    </div>
  );
}

export default App;
