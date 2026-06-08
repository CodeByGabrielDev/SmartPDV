# 🛒 SmartPDV

Sistema de Ponto de Venda (PDV) completo com módulo fiscal, controle de estoque, gestão de caixa e dashboard em tempo real.

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Backend | Java 21 + Spring Boot 3 |
| Frontend | React + Vite |
| Banco de dados | MySQL |
| ORM | Hibernate / Spring Data JPA |
| Autenticação | JWT |
| Integração externa | ViaCEP API |

---

## 📦 Módulos

### 🏪 PDV / Venda
- Registro de venda com leitura de código de barras
- Validação de estoque em tempo real antes de adicionar o item
- Venda com ou sem vínculo de cliente (CPF/CNPJ opcional)
- Desconto por item (%)
- Cancelamento de venda com estorno automático de estoque

### 💳 Pagamento
- Seleção de forma de pagamento (PIX, débito, crédito, dinheiro, etc.)
- Parcelamento em até 12x para cartão de crédito
- Emissão automática de NF-e ao confirmar pagamento

### 🧾 Nota Fiscal
- Emissão automática vinculada à venda
- Emissão avulsa (CFOP 5101, 5102, 6101, 6102)
- Transferência entre lojas (CFOP 5152 / 6152) com registro de trânsito
- Visualização detalhada: resumo, itens e grupos de imposto (ICMS, PIS, COFINS, IPI, IBS, CBS)
- Status: PENDENTE, AUTORIZADA, CANCELADA, RECUSADA
- Cálculo de imposto com redução de base de cálculo

### 💵 Caixa
- Abertura e fechamento de caixa por loja
- Cronômetro de tempo de caixa aberto
- Resumo de movimentação ao fechar
- Sincronização automática com o backend (evita estado fantasma no frontend)

### 📦 Estoque
- Controle de saldo por produto e por loja
- Validação de disponibilidade no momento da venda
- Estorno de estoque em cancelamentos

### 🚛 Entrada de Mercadoria
- Recebimento de notas em trânsito
- Alimentação automática do estoque ao confirmar entrada

### 👥 Clientes
- Cadastro com integração ViaCEP (preenchimento automático de endereço)
- Edição de cadastro
- Listagem por loja

### 🏷️ Produtos
- Cadastro por código de barras e SKU
- Precificação (custo e preço de venda)
- Inativação de produtos

### 🏦 Impostos (Exceção de Imposto)
- Configuração de alíquotas por CFOP e por loja
- Suporte a redução de base de cálculo
- Obrigatório para emissão de NF-e

### 👤 Usuários e Perfis
- Registro de funcionários vinculados à loja
- Perfis: `FUNCIONARIO`, `GERENTE`, `ADMIN`, `MATRIZ`, `CONTABILIDADE`
- Reset de senha com validação de senha atual
- Controle de acesso por perfil em cada endpoint

### 📊 Dashboard
- Faturamento do dia em tempo real
- Ticket médio e total de descontos
- Gráfico de faturamento por hora (barras SVG)
- Últimas 5 vendas do dia
- Notas fiscais emitidas
- Entradas de mercadoria pendentes

---

## 🗂️ Estrutura do Projeto

SmartPDV/ ├── backend/ # Spring Boot API REST │ └── src/main/java/ │ ├── Controller/ # Endpoints REST │ ├── Services/ # Regras de negócio │ ├── Repository/ # Queries JPA │ ├── Entities/ # Entidades JPA │ ├── DTOs/ # Request e Response DTOs │ ├── Enum/ # Enums do sistema │ ├── Config/ # JWT, CORS, Security │ └── Utils/ # Validadores └── frontend/ # React + Vite SPA └── src/ ├── pages/ # Páginas da aplicação ├── api/ # Services de chamada à API └── components/ # Componentes reutilizáveis


---

## 🔐 Autenticação

A API usa **JWT Bearer Token**. Todas as rotas (exceto login e registro) requerem o header:

Authorization: Bearer <token>


---

## 🚀 Como rodar localmente

### Pré-requisitos
- Java 21+
- Node.js 18+
- MySQL 8+

### Backend

```bash
cd backend

# Configure o banco no application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/smartpdv
# spring.datasource.username=seu_usuario
# spring.datasource.password=sua_senha

# Rode o projeto
./mvnw spring-boot:run
A API sobe em http://localhost:8080

Frontend
cd frontend
npm install
npm run dev
O frontend sobe em http://localhost:5173

📡 Principais Endpoints
Método	Rota	Descrição
POST	/api-smartpdv/auth/login	Login e geração de token JWT
POST	/api-smartpdv/point-of-sale	Registrar venda
DELETE	/api-smartpdv/point-of-sale/cancelar/{id}	Cancelar venda
GET	/api-smartpdv/point-of-sale/sales-report	Relatório de vendas por período
POST	/api-smartpdv/v1/cashiers/open	Abrir caixa
PUT	/api-smartpdv/v1/cashiers/{id}/close	Fechar caixa
GET	/api-smartpdv/v1/cashiers/status	Buscar caixa aberto
POST	/api-smartpdv/v1/invoice	Emitir nota fiscal avulsa
GET	/api-smartpdv/v1/invoice	Listar notas fiscais da loja
POST	/api-smartpdv/v1/payment	Inserir pagamento
GET	/api-smartpdv/stock/	Listar estoque da loja
GET	/api-smartpdv/goods-receipt/	Listar notas em trânsito
POST	/api-smartpdv/goods-receipt/{id}	Confirmar entrada de mercadoria
🔒 Controle de Acesso por Perfil
Ação	Perfis permitidos
Registrar venda	FUNCIONARIO, GERENTE, ADMIN
Cadastrar produto	GERENTE, ADMIN, MATRIZ
Inativar produto	GERENTE, ADMIN, MATRIZ
Criar exceção de imposto	CONTABILIDADE, ADMIN
Emitir NF-e de transferência	MATRIZ, ADMIN
Cancelar venda (estorno)	Todos autenticados
🧠 Regras de Negócio Relevantes
Não é possível realizar venda sem um caixa aberto na loja
Todo pagamento gera automaticamente uma NF-e de venda (CFOP 5102)
A NF-e só é emitida se a loja tiver uma exceção de imposto configurada para o CFOP correspondente
Transferências entre lojas (5152/6152) criam um registro de trânsito que precisa ser confirmado pela loja destino para alimentar o estoque
O estoque é debitado no momento da venda e estornado em caso de cancelamento
Vendas podem ser realizadas sem vínculo de cliente (venda anônima)
📄 Licença
Desenvolvido por Gabriel Lima — SmartPDV © 2026
