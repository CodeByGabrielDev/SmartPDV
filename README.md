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

```java
UsuariosLoja usuarioSession =
    (UsuariosLoja) SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getPrincipal();
```

---

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

```
/api-smartpdv/v1/
```

Exemplos:

```
POST   /api-smartpdv/v1/cashiers/open
PUT    /api-smartpdv/v1/cashiers/{id}/close
```

---

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
