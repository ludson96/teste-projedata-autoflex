# Teste Prático - `Autoflex`

Projeto desenvolvido como parte do processo seletivo para a vaga de `Desenvolvedor de Software Full Stack Júnior`.

## 🛠️ Linguagens e ferramentas

### Backend

[![Java][Java-logo]][Java-url]
[![Spring][Spring-logo]][Spring-url]
[![Spring Boot][Spring boot-logo]][Spring boot-url]
[![Hibernate][Hibernate-logo]][Hibernate-url]
[![Apache Maven][Apache Maven-logo]][Apache Maven-url]

### Frontend

[![React][React-logo]][React-url]
[![TypeScript][TypeScript-logo]][TypeScript-url]
[![Tailwind-CSS][Tailwind-CSS-logo]][Tailwind-CSS-url]
[![Redux][Redux-logo]][Redux-url]
[![RTL][RTL-logo]][RTL-url]
[![HTML5][HTML5-logo]][HTML5-url]
[![CSS3][CSS3-logo]][CSS3-url]

### Testes

[![Jest][Jest-logo]][Jest-url]
[![Mocha][Mocha-logo]][Mocha-url]

### DevOps & Outros

[![Git][Git-logo]][Git-url]
[![Docker][Docker-logo]][Docker-url]

## 📝 Sobre o Projeto

O projeto **Autoflex** é uma aplicação web full-stack para gestão de estoque, simulando um sistema para uma empresa do ramo automotivo.

O sistema permite o controle completo do inventário de produtos, com as seguintes funcionalidades:

* Cadastro, visualização, edição e exclusão de itens.
* Gerenciamento de níveis de estoque.
* Busca e filtragem de produtos.

## 🚀 Como Executar

### Pré-requisitos

*   **Java JDK** (versão 17 ou superior)
*   **Git**
*   **Node.js** e **npm** (para o frontend)
*   **Docker** e **Docker Compose** (para o banco de dados)

### Banco de Dados com Docker

O projeto utiliza um banco de dados PostgreSQL. A maneira mais fácil de iniciar o banco de dados é usando Docker Compose.

1.  Certifique-se de que o Docker está em execução em sua máquina.
2.  Na raiz do projeto, execute o seguinte comando para iniciar o contêiner do PostgreSQL em segundo plano:

    ```bash
    docker-compose up -d
    ```

    Isso iniciará um banco de dados PostgreSQL na porta `5432`, que o backend usará para se conectar.

### Passo a passo

1. **Clone o repositório:**

    ```bash
    git clone https://github.com/ludson96/teste-pratico-projedata.git
    cd teste-pratico-projedata
    ```

2. **Backend (Java):**
    * Abra o projeto em sua IDE de preferência (IntelliJ IDEA, Eclipse, VS Code).
    * Aguarde o Maven baixar as dependências.
    * Execute a classe principal `backend/src/main/java/com/ludson/inventory_api/ProductionPlanningApiApplication.java`.

3. **Frontend (React):**
    * Navegue até a pasta do frontend (ex: `cd frontend`).
    * Instale as dependências com `npm install`.
    * Inicie a aplicação com `npm start` ou `npm run dev`.

[Git-logo]: https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white
[Git-url]: https://git-scm.com

[Java-logo]: https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white
[Java-url]: https://www.java.com/pt-BR/

[Apache Maven-logo]: https://img.shields.io/badge/Apache%20Maven-C71A36?style=for-the-badge&logo=Apache%20Maven&logoColor=white
[Apache Maven-url]: https://maven.apache.org/

[Docker-logo]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com

[Spring-logo]: https://img.shields.io/badge/Spring-6DB33F.svg?style=for-the-badge&logo=Spring&logoColor=white
[Spring-url]: https://spring.io/

[Spring boot-logo]:https://img.shields.io/badge/Spring%20Boot-6DB33F.svg?style=for-the-badge&logo=Spring-Boot&logoColor=white
[Spring boot-url]: https://spring.io/projects/spring-boot

[Hibernate-logo]: https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=Hibernate&logoColor=white
[Hibernate-url]: https://hibernate.org/

[HTML5-logo]: https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[HTML5-url]: https://developer.mozilla.org/pt-BR/docs/Web/HTML
[CSS3-logo]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/pt-BR/docs/Web/CSS
[React-logo]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactjs.org
[RTL-logo]: https://img.shields.io/badge/-TestingLibrary-%23E33332?style=for-the-badge&logo=testing-library&logoColor=white
[RTL-url]: https://testing-library.com/
[Redux-logo]: https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[Redux-url]: https://redux.js.org
[Jest-logo]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[Jest-url]: https://jestjs.io
[Mocha-logo]: https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white
[Mocha-url]: https://mochajs.org
[TypeScript-logo]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Tailwind-CSS-logo]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-CSS-url]: https://tailwindcss.com/
