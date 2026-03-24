<<<<<<< HEAD
# 🚀 SmartPDV - Sistema de Ponto de Venda Enterprise

Sistema de **Ponto de Venda (PDV)** desenvolvido com **Java e Spring Boot**, focado em **arquitetura backend robusta, segurança, regras de negócio complexas e boas práticas de desenvolvimento**.

O projeto evoluiu para um sistema fiscal completo, simulando **cenários reais de operação de PDV corporativo**.

---

# 📋 Visão Geral do Projeto

O **SmartPDV** é mais do que um simples CRUD — é um sistema completo de gestão de vendas com:

* ✅ Autenticação **Stateless com JWT**
* ✅ **Módulo Fiscal Completo** (NF-e, impostos, CFOP)
* ✅ **Controle de Estoque entre lojas**
* ✅ **Gestão de Caixa** (abertura / fechamento)
* ✅ **Segurança empresarial com controle por filial**
* ✅ **Integração Oracle com PL/SQL**

---

# 🛠️ Tecnologias Utilizadas

| Categoria      | Tecnologia            |
| -------------- | --------------------- |
| Linguagem      | Java 17+              |
| Framework      | Spring Boot 3.x       |
| Segurança      | Spring Security + JWT |
| Banco de Dados | Oracle Database       |
| ORM            | JPA / Hibernate       |
| Build          | Maven                 |
| Anotações      | Lombok                |

---

# 🏗️ Arquitetura do Sistema

O projeto segue uma **arquitetura em camadas bem definida**, separando responsabilidades.

```
src/main/java/br/com/SmartPDV/SmartPDV/

├── Config/                  # Configurações de segurança
│   ├── SecurityConfiguration.java
│   ├── JwtAuthenticationFilter.java
│   ├── TokenService.java
│   ├── HashSenha.java
│   └── UsuariosLojaDetailsService.java
│
├── Controller/              # Endpoints REST
│   ├── CaixaController.java
│   ├── EntradaDeMercadoriaController.java
│   ├── NotaFiscalController.java
│   ├── PaginaPrincipalController.java
│   └── ...
│
├── Service/                 # Regras de negócio
│   ├── CaixaService.java
│   ├── NotaFiscalService.java
│   ├── NotaFiscalItemService.java
│   ├── NotaFiscalImpostoItemService.java
│   ├── TransitoLojaService.java
│   ├── AlimentaEstoqueLojaService.java
│   └── ...
│
├── Entity/                  # Modelos de domínio
│   ├── NotaFiscal.java
│   ├── NotaFiscalItem.java
│   ├── NotaFiscalImpostoItem.java
│   ├── ExcecaoImposto.java
│   ├── TransitoLoja.java
│   ├── EstoqueProduto.java
│   ├── Caixa.java
│   ├── Venda.java
│   ├── Produto.java
│   ├── Clientes.java
│   ├── Loja.java
│   └── UsuariosLoja.java
│
├── Repository/              # Camada de acesso a dados
│   ├── NotaFiscalRepository.java
│   ├── ProdutoRepository.java
│   ├── ClienteRepository.java
│   └── ...
│
├── DTOs/                    # Data Transfer Objects
│   ├── RequestDTOs/
│   └── ResponseDTOs/
│
├── Enum/                    # Enumeradores
│   ├── StatusNotaFiscal.java
│   ├── TipoImposto.java
│   ├── PerfilVendedor.java
│   └── ...
│
├── Exceptions/              # Tratamento global de erros
│   └── GlobalExceptionHandler.java
│
└── Utils/                   # Utilitários
    └── Validator.java
```

---

# 🧾 Módulo Fiscal

O **módulo fiscal** é o coração do sistema, implementando a complexidade da **legislação tributária brasileira**.

## Entidades Fiscais

| Entidade              | Descrição                                               |
| --------------------- | ------------------------------------------------------- |
| NotaFiscal            | Cabeçalho da nota fiscal (número, série, CFOP, valores) |
| NotaFiscalItem        | Itens individuais da nota fiscal                        |
| NotaFiscalImpostoItem | Cálculo de impostos por item                            |
| ExcecaoImposto        | Regras fiscais específicas por filial                   |
| ExcecaoImpostoItem    | Itens da exceção fiscal                                 |

---

## Tipos de Impostos Suportados

```java
public enum TipoImposto {

    ICMS(1),   // Imposto sobre Circulação de Mercadorias
    PIS(2),    // Programa de Integração Social
    COFINS(3), // Contribuição para o PIS/PASEP
    IPI(4),    // Imposto sobre Produtos Industrializados
    IBS(5),    // Imposto sobre Bens e Serviços
    CBS(6);    // Contribuição sobre Bens e Serviços

}
```

---

## Cálculo de Impostos

O sistema calcula automaticamente:

* ✅ Base de cálculo com redução
* ✅ Valor do imposto por alíquota
* ✅ ICMS, PIS, COFINS e IPI por item
* ✅ Total de impostos da nota

```java
notaItemImposto.setValorImpostoCalculado(
    notaItemImposto.getBaseCalculo() * (e.getAliquota() / 100)
);
```

---

# 📦 Módulo de Estoque e Transferência

## Fluxo de Transferência entre Lojas

```
┌─────────────┐    CFOP 5152/6152    ┌─────────────┐
│   MATRIZ    │ ──────────────────→  │   FILIAL    │
│  (Origem)   │   Gera Nota Fiscal   │  (Destino)  │
└─────────────┘                      └─────────────┘
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │ Entrada de          │
                                    │ Mercadoria          │
                                    │ (TransitoLoja)      │
                                    └─────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │ Alimenta Estoque    │
                                    │ (Atualiza estoque)  │
                                    └─────────────────────┘
```

---

## Entidades de Estoque

| Entidade                   | Descrição                           |
| -------------------------- | ----------------------------------- |
| TransitoLoja               | Controle de mercadorias em trânsito |
| EstoqueProduto             | Saldo de estoque por produto/loja   |
| AlimentaEstoqueLojaService | Engine de atualização de estoque    |

---

# 💰 Módulo de Caixa

## Funcionalidades

* ✅ **Abertura de Caixa** — iniciar operações do dia
* ✅ **Fechamento de Caixa** — encerramento com resumo
* ✅ **Validação por loja**
* ✅ **Auditoria de operações**

---

## Regras de Negócio

```java
if (usuarioSession.getLojaVinculada().getId() != caixa.getLoja().getId()) {

    throw new ResponseStatusException(
        HttpStatus.UNAUTHORIZED,
        "Você não possui autorização para fechar o caixa de outra loja"
    );

}

if (caixa.getFechado()) {
    throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "Caixa já fechado"
    );
}
```

---

# 🔐 Sistema de Segurança

O sistema utiliza **JWT para autenticação stateless**.

### Fluxo de autenticação

1️⃣ Usuário faz login
2️⃣ Servidor gera token JWT
3️⃣ Token enviado no header:

```
Authorization: Bearer <token>
```

4️⃣ `JwtAuthenticationFilter` valida o token
5️⃣ `SecurityContext` é populado com o usuário

---

## Recuperação do Usuário Autenticado
=======
# SmartPDV

Sistema de Ponto de Venda (PDV) desenvolvido com foco em arquitetura backend, segurança, regra de negócio bem definida e boas práticas com Java e Spring.

O projeto evoluiu além de um CRUD simples e atualmente possui autenticação stateless com JWT, controle de contexto por loja, validações centralizadas na camada de serviço e integração com Oracle utilizando PL/SQL.

---

## Tecnologias Utilizadas

- Java 17
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- JPA / Hibernate
- Oracle Database
- PL/SQL
- Maven
- Lombok

---

## Segurança

O sistema utiliza autenticação stateless baseada em JWT integrada ao Spring Security.

### Fluxo de autenticação

1. O usuário realiza login.
2. O backend gera um token JWT.
3. A cada requisição protegida:
   - O JwtAuthenticationFilter intercepta a requisição.
   - O token é validado.
   - O usuário é recuperado no banco.
   - O SecurityContext é populado.
4. O sistema identifica automaticamente:
   - Usuário autenticado
   - Loja vinculada
   - Permissões

Exemplo de recuperação do usuário logado:
>>>>>>> 444d8d4a31069ea22611dbac17c0a64296a33e1c

```java
UsuariosLoja usuarioSession =
    (UsuariosLoja) SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getPrincipal();
```

---

<<<<<<< HEAD
# 🏬 Controle por Filial

Cada usuário é vinculado a uma **loja específica**, garantindo:

* Operações associadas automaticamente à loja correta
* Separação entre filiais
* Redução de erros humanos

---

## Perfis de Usuário

| Perfil | Descrição                                             |
| ------ | ----------------------------------------------------- |
| MATRIZ | Pode emitir notas de transferência (CFOP 5152 / 6152) |
| FILIAL | Operações normais de venda                            |

---

# 📡 Endpoints da API

## Versionamento
=======
## Contexto de Loja

Cada funcionário (`UsuariosLoja`) é cadastrado já vinculado a uma loja específica.

Isso permite que:

- Toda venda seja automaticamente associada à loja correta.
- Abertura e fechamento de caixa respeitem o contexto do login.
- O sistema evite conflitos entre filiais.
- Haja redução de erro humano na seleção de loja.

---

## Módulo de Caixa

Funcionalidades implementadas:

- Abertura de caixa
- Fechamento de caixa
- Validação de caixa já aberto por loja
- Controle de autorização por loja vinculada
- Alimentação de caixa aberto

### Regras implementadas

- Não é permitido abrir dois caixas simultaneamente para a mesma loja.
- Não é permitido fechar caixa de loja diferente da vinculada ao usuário.
- Toda operação valida o contexto do usuário autenticado.
- Conflito de filial gera erro HTTP apropriado.

---

## Regra de Negócio

A regra de negócio está centralizada na camada Service.

Controllers apenas expõem endpoints e delegam responsabilidade.

Exemplos de validações implementadas:

- CPF duplicado por loja
- Email já existente
- Validação de senha forte
- Conflito de filial no fechamento de caixa
- Verificação de caixa já aberto

Essa abordagem torna o código:

- Mais previsível
- Mais testável
- Mais sustentável

---

## Banco de Dados

Banco utilizado: Oracle

Características:

- Estrutura relacional com integridade referencial
- Uso de PL/SQL para reforço de regras críticas no banco
- Validações complementares ao backend

Objetivo: garantir que regras essenciais não dependam exclusivamente da aplicação.

---

## Estrutura do Projeto

```
src/main/java/br/com/SmartPDV/SmartPDV

├── Config
│   ├── SecurityConfiguration
│   ├── JwtAuthenticationFilter
│   └── UsuariosLojaDetailsService
│
├── Controller
│   ├── AuthController
│   └── CaixaController
│
├── Services
│   ├── CaixaService
│   └── ...
│
├── Entities
│   ├── UsuariosLoja
│   ├── Loja
│   ├── Caixa
│   └── Venda
│
├── Repository
│   ├── FuncionarioLoja
│   ├── CaixaRepository
│   └── ...
│
└── ResponseDTOs
```

---

## Versionamento da API

A API segue padrão versionado:
>>>>>>> 444d8d4a31069ea22611dbac17c0a64296a33e1c

```
/api-smartpdv/v1/
```

<<<<<<< HEAD
---

## Autenticação

```
POST /api-smartpdv/v1/auth/login
POST /api-smartpdv/v1/auth/register
=======
Exemplos:

```
POST   /api-smartpdv/v1/cashiers/open
PUT    /api-smartpdv/v1/cashiers/{id}/close
>>>>>>> 444d8d4a31069ea22611dbac17c0a64296a33e1c
```

---

<<<<<<< HEAD
## Caixa

```
POST /api-smartpdv/v1/cashiers/open
PUT  /api-smartpdv/v1/cashiers/{id}/close
```

---

## Nota Fiscal

```
POST /api-smartpdv/v1/invoice
```

---

## Entrada de Mercadoria

```
GET /api-smartpdv/goods-receipt
PUT /api-smartpdv/goods-receipt/{id}
```

---

# 💾 Banco de Dados

Características:

* **Oracle Database**
* **PL/SQL para regras críticas**
* **JPA / Hibernate**
* **Integridade referencial completa**

Estrutura com:

* Foreign Keys
* Constraints
* Procedures e Triggers PL/SQL

---

# 🎯 Boas Práticas Aplicadas

| Prática            | Aplicação                            |
| ------------------ | ------------------------------------ |
| SOLID              | Separação clara de responsabilidades |
| DTOs               | Transferência de dados estruturada   |
| Transactions       | `@Transactional` para consistência   |
| Exception Handling | `GlobalExceptionHandler`             |
| Repository Pattern | Abstração de acesso a dados          |
| Lombok             | Redução de boilerplate               |
| Security           | JWT + Spring Security                |

---

# 🚀 Como Executar

## Pré-requisitos

* Java 17+
* Maven 3.8+
* Oracle Database

---

## Configuração

Edite:

```
src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:ORCL
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
```

---

## Executando o Projeto

### Compilar

```
./mvnw clean install
```

### Executar

```
./mvnw spring-boot:run
```

---

# 📊 Entidades do Domínio

| Módulo     | Entidades                                         |
| ---------- | ------------------------------------------------- |
| Segurança  | UsuariosLoja, Loja                                |
| Cadastro   | Produto, Clientes                                 |
| Vendas     | Venda, ItemVenda, Pagamento                       |
| Fiscal     | NotaFiscal, NotaFiscalItem, NotaFiscalImpostoItem |
| Estoque    | EstoqueProduto, TransitoLoja                      |
| Financeiro | Caixa, FormaPgto, BandeirasCartao                 |

---

# 🎓 Objetivo do Projeto

O **SmartPDV** foi criado com foco em:

* Modelagem de **domínio real de varejo**
* **Arquitetura backend escalável**
* **Segurança corporativa**
* Simulação de **complexidade fiscal**
* Aplicação de **boas práticas de engenharia de software**

---

# 📈 Em Evolução Constante

O projeto continua evoluindo com:

* 🔄 Novas funcionalidades
* 🐛 Correções de bugs
* ⚡ Otimizações de performance
* 📝 Melhoria de arquitetura

---

# 👨‍💻 Autor

**Gabriel Lima de Oliveira**

Desenvolvedor **Java Backend**
=======
## Próximos Passos

- Implementação completa do módulo de vendas
- Controle mais refinado de roles/perfis
- Integração com frontend (Angular)
- Melhorias em auditoria e logs
- Implementação de testes automatizados

---

## Objetivo do Projeto

O SmartPDV é um projeto focado em evolução técnica e boas práticas, contemplando:

- Arquitetura backend
- Segurança com JWT
- Regra de negócio centralizada
- Integração com banco corporativo (Oracle)
- Estrutura preparada para escalar

---

## Autor

Gabriel Lima de Oliveira  
Desenvolvedor Java Backend
>>>>>>> 444d8d4a31069ea22611dbac17c0a64296a33e1c
