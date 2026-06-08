# 🛒 SmartPDV

Sistema de Ponto de Venda (PDV) completo com módulo fiscal, controle de estoque, gestão de caixa e dashboard em tempo real.

---

# 🧱 Stack

| Camada | Tecnologia |
|----------|------------|
| Backend | Java 21 + Spring Boot 3 |
| Frontend | React + Vite |
| Banco de Dados | MySQL |
| ORM | Hibernate / Spring Data JPA |
| Autenticação | JWT |
| Integração Externa | ViaCEP API |

---

# 📦 Módulos

## 🏪 PDV / Venda

- Registro de venda com leitura de código de barras
- Validação de estoque em tempo real antes de adicionar o item
- Venda com ou sem vínculo de cliente (CPF/CNPJ opcional)
- Desconto por item em porcentagem
- Cancelamento de venda com estorno automático de estoque

## 💳 Pagamento

- Seleção de forma de pagamento (PIX, débito, crédito, dinheiro, etc.)
- Parcelamento em até 12x para cartão de crédito
- Emissão automática de NF-e ao confirmar pagamento

## 🧾 Nota Fiscal

- Emissão automática vinculada à venda (CFOP 5102)
- Emissão avulsa com suporte a múltiplos CFOPs (5101, 5102, 6101, 6102)
- Transferência entre lojas (CFOP 5152 / 6152) com registro de trânsito
- Visualização detalhada com abas:
  - Resumo
  - Itens
  - Grupos de imposto
- Cálculo de imposto com suporte a redução de base de cálculo
- Grupos suportados:
  - ICMS
  - PIS
  - COFINS
  - IPI
  - IBS
  - CBS
- Status:
  - PENDENTE
  - AUTORIZADA
  - CANCELADA
  - RECUSADA

## 💵 Caixa

- Abertura e fechamento de caixa por loja
- Cronômetro de tempo de caixa aberto em tempo real
- Resumo de movimentação ao fechar
- Sincronização automática com backend ao carregar a página

## 📦 Estoque

- Controle de saldo por produto e por loja
- Validação de disponibilidade no momento da venda
- Estorno automático de estoque em cancelamentos

## 🚛 Entrada de Mercadoria

- Recebimento de notas em trânsito emitidas pela matriz
- Alimentação automática do estoque ao confirmar entrada

## 👥 Clientes

- Cadastro com integração ViaCEP (preenchimento automático de endereço)
- Edição de dados cadastrais
- Listagem por loja

## 🏷️ Produtos

- Cadastro por código de barras e SKU
- Precificação com custo e preço de venda
- Inativação de produtos

## 📊 Impostos — Exceção de Imposto

- Configuração de alíquotas por CFOP e por loja
- Suporte a redução de base de cálculo
- Obrigatório para emissão de qualquer NF-e

## 👤 Usuários e Perfis

- Registro de funcionários vinculados à loja
- Perfis:
  - FUNCIONARIO
  - GERENTE
  - ADMIN
  - MATRIZ
  - CONTABILIDADE
- Reset de senha com validação da senha atual
- Controle de acesso por perfil em cada endpoint

## 📊 Dashboard

- Faturamento do dia em tempo real
- Ticket médio e total de descontos
- Gráfico de faturamento por hora (barras SVG sem dependências externas)
- Últimas 5 vendas do dia com hora e vendedor
- Contador de notas fiscais emitidas
- Alertas de entradas de mercadoria pendentes

---

# 🗂️ Estrutura do Projeto

```text
SmartPDV/
├── backend/
│   └── src/main/java/
│       ├── Controller/       # Endpoints REST
│       ├── Services/         # Regras de negócio
│       ├── Repository/       # Queries JPA
│       ├── Entities/         # Entidades JPA / tabelas
│       ├── DTOs/             # Request e Response DTOs
│       ├── Enum/             # Enumeradores do sistema
│       ├── Config/           # JWT, CORS, Security
│       └── Utils/            # Validadores utilitários
└── frontend/
    └── src/
        ├── pages/            # Páginas da aplicação
        ├── api/              # Serviços de chamada à API REST
        └── components/       # Componentes reutilizáveis
```

---

# 🔐 Autenticação

A API utiliza **JWT Bearer Token**.

Todas as rotas, exceto login e registro, requerem o header:

```http
Authorization: Bearer <seu_token>
```

---

# 🚀 Como Rodar Localmente

## Pré-requisitos

- Java 21+
- Node.js 18+
- MySQL 8+

## Backend

```bash
cd backend
```

Configure o banco em `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smartpdv
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
```

Suba a aplicação:

```bash
./mvnw spring-boot:run
```

API disponível em:

```text
http://localhost:8080
```

## Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

---

# 📡 Principais Endpoints

| Método | Rota | Descrição |
|----------|----------|----------|
| POST | `/api-smartpdv/auth/login` | Login e geração de token JWT |
| POST | `/api-smartpdv/auth/register` | Registro de funcionário |
| POST | `/api-smartpdv/point-of-sale` | Registrar venda |
| DELETE | `/api-smartpdv/point-of-sale/cancelar/{id}` | Cancelar venda com estorno |
| GET | `/api-smartpdv/point-of-sale/sales-report` | Relatório de vendas por período |
| POST | `/api-smartpdv/v1/cashiers/open` | Abrir caixa |
| PUT | `/api-smartpdv/v1/cashiers/{id}/close` | Fechar caixa |
| GET | `/api-smartpdv/v1/cashiers/status` | Verificar caixa aberto |
| POST | `/api-smartpdv/v1/invoice` | Emitir nota fiscal avulsa |
| GET | `/api-smartpdv/v1/invoice` | Listar notas fiscais da loja |
| POST | `/api-smartpdv/v1/payment` | Processar pagamento |
| GET | `/api-smartpdv/stock/` | Listar estoque da loja |
| GET | `/api-smartpdv/goods-receipt/` | Listar notas em trânsito |
| POST | `/api-smartpdv/goods-receipt/{id}` | Confirmar entrada de mercadoria |

---

# 🔒 Controle de Acesso por Perfil

| Ação | Perfis Permitidos |
|--------|------------------|
| Registrar venda | FUNCIONARIO, GERENTE, ADMIN |
| Cadastrar produto | GERENTE, ADMIN, MATRIZ |
| Inativar produto | GERENTE, ADMIN, MATRIZ |
| Criar exceção de imposto | CONTABILIDADE, ADMIN |
| Emitir NF-e de transferência | MATRIZ, ADMIN |
| Fechar caixa | Operador da loja autenticado |

---

# 🧠 Regras de Negócio Relevantes

- Não é possível registrar uma venda sem um caixa aberto na loja
- Todo pagamento confirmado gera automaticamente uma NF-e (CFOP 5102)
- A NF-e só é emitida se a loja possuir uma exceção de imposto configurada para o CFOP correspondente
- Transferências entre lojas (5152/6152) geram um registro de trânsito que precisa ser confirmado pela loja destino para alimentar o estoque
- O estoque é debitado no momento da venda e estornado no cancelamento
- Vendas podem ser realizadas sem identificação de cliente
- O frontend sincroniza o estado do caixa com o backend ao carregar, evitando exibição de caixa inexistente

---

# 📄 Licença

Desenvolvido por **Gabriel Lima** — SmartPDV © 2026
