# 🛒 SmartPDV — Sistema de Ponto de Venda

Sistema de **Ponto de Venda (PDV)** completo, desenvolvido com **Java + Spring Boot** no backend e **React** no frontend, simulando cenários reais de operação de PDV corporativo com módulo fiscal integrado.

---

## 🧱 Tecnologias

| Camada    | Tecnologia                              |
|-----------|-----------------------------------------|
| Backend   | Java 17, Spring Boot 3.x, Spring Security, JWT |
| Banco     | Oracle Database, JPA / Hibernate, PL/SQL |
| Build     | Maven, Lombok                           |
| Frontend  | React 19, React Router 7, Vite          |

---

## ✅ Funcionalidades

- Autenticação **stateless com JWT**
- **Módulo Fiscal Completo** — NF-e, impostos (ICMS, PIS, COFINS, IPI, IBS, CBS), CFOP
- **Controle de Estoque** entre lojas com transferência via nota fiscal
- **Gestão de Caixa** — abertura, fechamento e auditoria
- **Segurança por filial** — cada usuário opera apenas na sua loja vinculada
- **Gestão de Clientes** e Produtos
- **Frontend React** com tema claro/escuro

---

## 🏗️ Arquitetura Backend

```
src/main/java/br/com/SmartPDV/SmartPDV/
├── Config/          # Segurança, JWT, filtros
├── Controller/      # Endpoints REST
├── Service/         # Regras de negócio
├── Entity/          # Modelos de domínio
├── Repository/      # Acesso a dados
├── DTOs/            # Request e Response DTOs
├── Enum/            # Enumeradores (TipoImposto, PerfilVendedor...)
├── Exceptions/      # GlobalExceptionHandler
└── Utils/           # Validadores
```

---

## 🔐 Segurança

Autenticação via JWT com Spring Security:

1. Usuário faz login → servidor gera token JWT
2. Token enviado no header: `Authorization: Bearer <token>`
3. `JwtAuthenticationFilter` valida e popula o `SecurityContext`
4. Cada usuário é vinculado a uma loja — operações são isoladas por filial

---

## 🧾 Módulo Fiscal

Impostos suportados: **ICMS, PIS, COFINS, IPI, IBS, CBS**

Calcula automaticamente base de cálculo, alíquotas e totais por item da nota fiscal. Suporta exceções fiscais por filial e CFOP de transferência entre lojas (5152 / 6152).

---

## 📦 Transferência de Estoque entre Lojas

```
MATRIZ → Emite NF (CFOP 5152) → FILIAL recebe → Entrada de Mercadoria → Estoque atualizado
```

---

## 📡 Endpoints principais

```
POST   /api-smartpdv/v1/auth/login
POST   /api-smartpdv/v1/auth/register
POST   /api-smartpdv/v1/cashiers/open
PUT    /api-smartpdv/v1/cashiers/{id}/close
POST   /api-smartpdv/v1/invoice
GET    /api-smartpdv/goods-receipt
PUT    /api-smartpdv/goods-receipt/{id}
```

---

## 🚀 Como executar

### Backend

**Pré-requisitos:** Java 17+, Maven 3.8+, Oracle Database

Configure `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:ORCL
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
```

```bash
./mvnw clean install
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 👨‍💻 Autor

**Gabriel Lima de Oliveira** — Desenvolvedor Java Backend
