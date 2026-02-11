# SmartPDV

Sistema de Ponto de Venda (PDV) desenvolvido com foco em arquitetura, segurança, regra de negócio bem definida e boas práticas de backend.

O projeto evoluiu além de um CRUD simples e hoje já contempla autenticação stateless com JWT, controle de contexto por loja, validações de negócio no service layer e integração com Oracle + PL/SQL.

---

## 🚀 Tecnologias Utilizadas

- Java 17
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Oracle Database
- PL/SQL
- JPA / Hibernate
- Lombok
- Maven

---

## 🔐 Segurança

O sistema utiliza:

- Autenticação stateless com JWT
- Filtro customizado (`JwtAuthenticationFilter`)
- `UserDetailsService` personalizado
- Contexto de autenticação via `SecurityContextHolder`

Fluxo:

1. Usuário realiza login
2. Token JWT é gerado
3. A cada requisição protegida:
   - O filtro valida o token
   - Recupera o usuário no banco
   - Injeta no `SecurityContext`
4. A aplicação identifica automaticamente:
   - Usuário logado
   - Loja vinculada
   - Permissões

---

## 🏪 Contexto de Loja

Cada funcionário (`UsuariosLoja`) é vinculado diretamente a uma loja.

Isso permite que:

- Toda venda seja automaticamente associada à loja correta
- Abertura e fechamento de caixa respeitem o contexto do login
- O sistema evite conflitos entre filiais
- Reduza erro humano na seleção de loja

Exemplo:

```java
UsuariosLoja usuarioSession = 
    (UsuariosLoja) SecurityContextHolder
        .getContext()
        .getAuthentication()
        .getPrincipal();
💰 Módulo de Caixa
Funcionalidades atuais:

Abertura de caixa

Fechamento de caixa

Validação de caixa já aberto por loja

Controle de autorização por loja vinculada

Regras importantes:

Não é permitido abrir dois caixas simultaneamente para a mesma loja

Não é permitido fechar caixa de outra loja

Toda operação valida o contexto do usuário autenticado

🧠 Regra de Negócio
A regra de negócio está centralizada na camada de Service.

Controllers apenas expõem endpoints.

Exemplo de validações implementadas:

CPF duplicado por loja

Email já existente

Validação de senha forte

Conflito de filial no fechamento de caixa

Verificação de caixa já aberto

🗄️ Banco de Dados
Banco utilizado: Oracle

Estrutura relacional bem definida

Integridade por chave estrangeira

Uso de PL/SQL para reforçar regras críticas no nível do banco

Objetivo:
Garantir que regras essenciais não dependam exclusivamente da aplicação.

📂 Estrutura do Projeto
Config
 ├── SecurityConfiguration
 ├── JwtAuthenticationFilter
 └── UsuariosLojaDetailsService

Controller
 ├── AuthController
 └── CaixaController

Service
 ├── CaixaService
 └── ...

Entities
 ├── UsuariosLoja
 ├── Loja
 ├── Caixa
 └── Venda

Repository
 ├── FuncionarioLoja
 ├── CaixaRepository
 └── ...
📌 Versionamento de API
Endpoints seguem padrão versionado:

/api-smartpdv/v1/...
Exemplo:

POST /api-smartpdv/v1/cashiers/open
PUT  /api-smartpdv/v1/cashiers/{id}/close
🔮 Próximos Passos
Implementação completa de vendas

Controle de roles/perfis mais refinado

Integração com frontend (Angular)

Melhorias em auditoria e logs

Evolução para arquitetura mais desacoplada

📚 Objetivo do Projeto
O SmartPDV não é apenas um sistema funcional.

É um ambiente real de estudo focado em:

Arquitetura backend

Segurança

Boas práticas

Tomada de decisão técnica

Estruturação de regra de negócio

Integração com banco corporativo

👨‍💻 Autor
Gabriel Lima de Oliveira
Desenvolvedor Java Backend
