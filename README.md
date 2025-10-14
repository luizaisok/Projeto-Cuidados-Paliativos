# PaliVida ─  Projeto Acadêmico sobre Cuidados Paliativos

O projeto consiste em um aplicativo mobile desenvolvido com finalidade acadêmica, voltado ao monitoramento do bem-estar de pacientes em cuidados paliativos. A proposta é auxiliar tanto os pacientes quanto seus cuidadores, oferecendo informações, orientações e recursos que promovam qualidade de vida, segurança e melhor comunicação entre pacientes, familiares e médicos.

* **Público-alvo:** pacientes em cuidado paliativos, familiares e médicos. 

---

## MVP ─ Principais Funcionalidades

### Requisitos Funcionias:

#### 1. Monitoramento do bem-estar
* O sistema deve disponibilizar um checklist/pop-up para registro de sintomas (ex.: dor de cabeça, enjoo, etc.) e calcular um score exibido em cores: 
  * 🟢 **Verde:** condição estável.  
  * 🟡 **Amarelo:** atenção necessária.  
  * 🔴 **Vermelho:** situação crítica com recomendação de procurar ajuda médica.  

#### 2. Prontuário do paciente
* O usuário poderá inserir e atualizar informações pessoais e histórico médico (nome, apelido, e-mail, data de nascimento, estado, cidade, gênero, tipo sanguíneo, condições médicas, medicamentos, contato de emergência e contato do hospital/médico responsável).
  
* **Pendência**: decisão futura sobre exportação dos dados ou integração com sistemas de hospitais/unidades de saúde.  

## Próximos Passos ─ Demais Funcionalidades 

### Requisitos Funcionais:

* **Registro de Conta:** O sistema deve permitir que o usuário crie uma conta, garantindo segurança e privacidade dos dados.
  
* **Orientação Baseada em Sintomas:** O sistema deve sugerir quando procurar ajuda profissional, exibindo recomendações claras de acordo com os sintomas registrados.
  
* **Aconselhamento e Recursos:** Disponibilizar materiais educativos sobre cuidados paliativos e apoio emocional para pacientes e familiares. 

### Requisitos Não Funcionais:

* **Usabilidade:** O sistema deve oferecer uma interface amigável, intuitiva e acessível, permitindo o uso por pessoas com pouca familiaridade com tecnologia.

* **Segurança e Privacidade:** Os dados do usuário devem ser protegidos, garantindo confidencialidade e integridade das informações pessoais e médicas.

* **Disponibilidade:** O sistema deve estar disponível de forma contínua, reduzindo ao mínimo as interrupções.

* **Desempenho:** O sistema deve processar o cálculo do score de sintomas de forma rápida (tempo de resposta em até alguns segundos).

* **Confiabilidade:** As informações cadastradas devem ser armazenadas corretamente, sem risco de perda ou alteração indevida.

<br>

| Requisito                          | Status                       | Descrição                                                                                                           |
| ---------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | 
| Monitoramento do bem-estar (F)     | ✅ Implementado (front-end) | Sistema deve exibir checklist ou pop-up para registrar sintomas                                                     |
| Cálculo do score (F)               | 🚧 Em desenvolvimento       | Sistema calcula um score de saúde e exibe cores indicando a condição                                                |
| Prontuário do paciente (F)         | ✅ Implementado (front-end) | Histórico de saúde disponível para paciente, familiar e médico                                                      |
| Registro de conta (F)              | 🚧 Em desenvolvimento       | Sistema permite criação de conta pelo usuário, garantindo segurança e privacidade dos dados                         |
| Orientação Baseada em Sintomas (F) | 🚧 Em desenvolvimento       | Sistema sugere buscar ajuda profissional, mostrando recomendações claras com base nos sintomas registrados          |
| Aconselhamento e Recursos (F)      | 🚧 Em desenvolvimento       | Sistema disponibiliza materiais educativos sobre cuidados paliativos e apoio emocional para pacientes e familiares  |
| Usabilidade (NF)                   | 🚧 Em desenvolvimento       | Sistema oferece interface amigável, intuitiva e acessível, adequada a usuários com pouca familiaridade tecnológica  |
| Segurança e Privacidade (NF)       | 🚧 Em desenvolvimento       | Sistema protege os dados do usuário, assegurando confidencialidade e integridade das informações pessoais e médicas |
| Disponibilidade (NF)               | 🚧 Em desenvolvimento       | Sistema deve operar continuamente, minimizando interrupções                                                         |
| Desempenho (NF)                    | 🚧 Em desenvolvimento       | Sistema processa o cálculo do score de sintomas rapidamente, com tempo de resposta de poucos segundos               |
| Confiablidade (NF)                 | 🚧 Em desenvolvimento       | Sistema armazena as informações cadastradas de forma segura, sem risco de perda ou alteração indevida               |

---

## Prototipação (Front-end)

Com base na prototipação de autofidelização do cliente, desenvolvemos nossa versão no Figma, que foi aprovada (pelo cliente) e atende aos requisitos de usabilidade e experiência do usuário.

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="./img/loading.png" alt="Protótipo Loading Figma" height="500px">
  <img src="./img/login.png" alt="Protótipo Login Figma" height="500px">
  <img src="./img/cadastro .png" alt="Protótipo Cadastro Figma" height="500px">
  <img src="./img/checklist.png" alt="Protótipo Checklist Figma" height="500px">
  <img src="./img/inicio.png" alt="Protótipo Início Figma" height="500px">
  <img src="./img/prontuario.png" alt="Protótipo Prontuário Figma" height="500px">
  <img src="./img/sinais-sintomas.png" alt="Protótipo Sinais e Sintomas Figma" height="500px">
  <img src="./img/atencao-verde.png" alt="Protótipo Atenção Cor Verde Figma" height="500px">
  <img src="./img/atencao-amarelo.png" alt="Protótipo Atenção Cor Amarelo Figma" height="500px">
  <img src="./img/atencao-vermelho.png" alt="Protótipo Atenção Cor Vermelho Figma" height="500px">
</div>

---

## Modelagem UML

### Casos de Uso

<img src="./img/caso-de-uso.png" alt="Diagrama de Caso de Uso" height="700px"><br>

### Diagrama de Classes

<img src="./img/diagrama-de-classes.png" alt="Diagrama de Classes" height="700px"><br>

<details>
    <summary><strong>Entenda o Paciente</strong></summary>
    <ul>
      <li>Acessar os contatos do paciente</li>
      <li>Acessar os dados do paciente</li>
      <li>Visualizar prontuário</li>
      <li>Acessar a sessão de hospitais</li>
      <li>Editar cadastro de usuário</li>
      <li>Excluir usuário</li>
      <li>Realizar cadastro</li>
      <li>Acessar o status de sintoma</li>
      <li>Acessar dados de familiares</li>
      <li>Acessar a sessão de dúvidas</li>
    </ul>
  </details>

  <details>
    <summary><strong>Entenda o Acompanhante</strong></summary>
    <ul>
      <li>Realizar cadastro</li>
      <li>Acessar o status de sintoma</li>
      <li>Acessar dados de familiares</li>
      <li>Acessar a sessão de dúvidas</li>
    </ul>
  </details>

  <details>
    <summary><strong>Entenda o Administrador</strong></summary>
    <ul>
      <li>Acessar os dados do paciente</li>
      <li>Visualizar prontuário</li>
      <li>Acessar a sessão de hospitais</li>
      <li>Editar cadastro de usuário</li>
      <li>Excluir usuário</li>
    </ul>
  </details>

---

## Tecnologias Utlizadas (até o momento)

* **Expo CLI:** ferramenta que facilita criar, desenvolver e testar aplicativos React Native rapidamente, sem precisar configurar nativamente Android ou iOS.
* **React Native e JavaScript:** linguagem e framework usados para construir a interface e a lógica do app mobile de forma declarativa e multiplataforma.
* **Ejs:** permite gerar páginas HTML dinâmicas no back-end, que podem ser consumidas pelo app ou navegador, útil para renderizar conteúdos vindos do servidor.

---

## Arquitetura do Projeto¹

<pre><code>
Projetos-Cuidados-Paliativos/
├─ API/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  └─ index.js
│  │  ├─ models/DAO/
│  │  │  └─ DAO/
│  │  │     ├─ AdministradorDAO.js
│  │  │     ├─ ConteudoDAO.js
│  │  │     ├─ PacienteDAO.js
│  │  │     └─ db.js
│  │  └─ views/
│  │     ├─ formPaciente.ejs
│  │     ├─ formadministrador.ejs
│  │     ├─ index.ejs
│  │     ├─ listaConteudo.ejs
│  │     ├─ listaPaciente.ejs
│  │     ├─ listaadministradores.ejs  #
│  │     └─ novoConteudo.ejs
│  ├─ package-lock.json
│  └─ package.json
├─ cuidados_paliativos/
│  ├─ src/
│  │  ├─ assets/
│  │  │  └─ TextoPadrao.js            # exporta fonte padrão
│  │  ├─ components/
│  │  │  ├─ Footer/
│  │  │  │  └─ index.js               # componente responsável pela exportação do footer
│  │  │  ├─ Header/
│  │  │  │  └─ index.js               # componente responsável pela exportação do header
│  │  │  └─ ListaSintomas/
│  │  │     └─ index.js               # componente responsável pela exportação do Flatlist que contém os sinais e sintomas
│  │  ├─ data/                        # contém listas utilizadas em Flatlists
│  │  │  └─ [...]
│  │  ├─ img/
│  │  │  └─ [...]                     # contém imagens utilizados na aplicação
│  │  └─ pages/
│  │     ├─ Duvidas.js                # página de dúvidas, onde o usuário terá acesso às demais páginas
│  │     ├─ MenuSintomas.js           # página do checklist/pop-up (menu) dos sinais e sintomas
│  │     └─ PerfilProntuario.js       # página do prontuário eletrônico do paciente
│  ├─ App.js                          # página principal (menu dos sinais e sintomas)
│  ├─ app.json
│  ├─ index.js                        # arquivo de entrada da aplicação, que registra e inicia o App.js (ou outro) no dispositivo
│  ├─ metro.config.js
│  ├─ package-lock.json               # registra versões exatas das dependências, garantindo consistência e evitando problemas de compatibilidade
│  └─ package.json                    # configuração da aplicação, listando dependências, scripts e metadados da aplicação (pacotes Node e React Native)
└─ package-lock.json                  # configuração do projeto, listando dependências, scripts e metadados do prjeto (pacotes Expo SDK)
</code></pre><br>

1 - Alguns arquivos e pastas foram omitidos por não serem essenciais para o entendimento do projeto.

---

## Como rodar em diferfentes ambientes:

### 1. Pré-requisitos

Antes de rodar a aplicação, você precisa ter alguns softwares instalados no seu computador:

#### 1.1 Git

O Git é necessário para clonar o repositório da aplicação.

* **Download:** [https://git-scm.com/downloads](https://git-scm.com/downloads).
* **Verificar instalação:** abra o terminal ou CMD/PowerShell e rode:

```bash
git --version
```

Se aparecer a versão do Git, está correto.

#### 1.2 Node.js

O Node.js é necessário para instalar pacotes e executar scripts do React Native.

* **Versão recomendada:** >= 18.0.0
* **Download:** [https://nodejs.org/](https://nodejs.org/).
* **Verificar instalação:**

```bash
node -v
npm -v
```

#### 1.3 Navegador moderno

Para usar o Expo Web e abrir a interface de controle da aplicação, é necessário um navegador moderno (Chrome, Edge, Firefox ou Safari atualizado).

#### 1.4 Expo CLI

O Expo facilita rodar a aplicação em web, Android e iOS sem complicações extras.

**Instalação via npm:**

```bash
npm install --global expo-cli

```

**Verificação:**

```bash
expo --version
```

Se aparecer a versão, está pronto.

**Observação**: Não é necessário instalá-lo, pois o mesmo já encontra-se presente no projeto.

### 2. Clonar o repositório

Com o Git instalado, clone o repositório da aplicação:

```bash
git clone https://github.com/luizaisok/Projeto-Cuidados-Paliativos.git
```

Entre na pasta do projeto:

```bash
cd cuidados_paliativos
```

### 3. Instalar dependências

Dentro da pasta do projeto, rode:

```bash
npm install
```

Isso instala todas as bibliotecas necessárias para rodar a aplicação (inclusive o `expo-cli`).

### 4. Rodar a aplicação

#### 4.1 Rodando no navegador (Web)

Se você quer apenas abrir a aplicação no navegador:

```bash
npx expo start --web
```

Isso abre a interface do Expo no navegador, com a aplicação rodando no modo web.

#### 4.2 Rodando no celular ou emulador

Se quiser testar no celular físico:

1. Abra o aplicativo Expo Go (Android ou iOS)
2. Escaneie o QR Code que aparece na interface do Expo (`npx expo start`)
3. A aplicação será carregada diretamente no seu dispositivo

Para emuladores (Android Studio ou Xcode), abra o emulador primeiro e depois rode:

```bash
npx expo start
```

E escolha a opção de abrir no emulador.

---

## Entenda sobre o Banco de Dados

Os dados foram **gerados artificialmente por IA (ChatGPT)**, que simulou um ambiente realista de pacientes em cuidados paliativos e seus cuidadores. Em seguida, foi desenvolvida uma automação em **Bash (.sh)** e **SQL (.sql)** para:

- Criar o *schema* do banco;
- Gerar as tabelas com suas relações e *constraints*;
- Popular o banco automaticamente com os dados.

### Estrutura dos arquivos/scripts

<pre>
PROJETO-CUIDADOS-PALIATIVOS(root)/
└── scripts/
    ├── run_db.sh                    # Script shell para automatizar a criação e população do banco
    ├── sql/
    │   ├── create_schema.sql        # Criação do dataset
    │   ├── create_tables.sql        # Criação das tabelas e definição do schema
    │   └── load_data.sql            # Inserção dos dados a partir dos CSVs
    └── csv/
        ├── usuarios.csv             # Dados de usuários (cadastro) 
        ├── cuidadores.csv           # Dados de cuidadores
        ├── pacientes.csv            # Dados de pacientes
        └── paciente_cuidador.csv    # Dados relacionais entre pacientes e cuidadores
</pre>

### Schema do banco

| **Tabela**              | **Colunas Principais**                                                                        | **Chaves**                                                                                   |
|-------------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| **usuarios**            | `id_usuario`, `nome`, `email`, `senha`, `tipo_usuario`                                        | **PK:** `id_usuario`                                                                         |
| **cuidadores**          | `id_cuidador`, `nome`, `cpf`, `telefone`, `turno`                                             | **PK:** `id_cuidador`                                                                        |
| **pacientes**           | `id_paciente`, `nome`, `cpf`, `data_nascimento`, `diagnostico`, `cuidador_responsavel_id`     | **PK:** `id_paciente`                                                                        |
| **paciente_cuidador**   | `id_relacao`, `id_paciente`, `id_cuidador`                                                    | **PK:** `id_relacao`<br>**FK:** `id_paciente`, `id_cuidador`                                 |

### Diagrama de relacionamento do banco

![Diagrama de relacionamento do banco de dados](./img/diagrama_relacionamento-bd.png)

<h2>Como criar o banco de dados local</h2>

<ol>
  <li><h3>Pré-requisitos</h3></li>
    <ul>
     <li>
       <strong><code>MySQL Server</code> instalado</strong><br>
       Caso você ainda não tenha o MySQL instalado, clique abaixo para baixar:<br>
       <a href="https://dev.mysql.com/downloads/mysql/" target="_blank">Baixar MySQL Server</a><br>
       Durante a instalação:
       <ul>
        <li>Defina um <strong>usuário root</strong> e uma <strong>senha</strong>.</li>
        <li>Lembre-se dessa senha, pois ela será usada no script de criação.</li>
       </ul>
     </li>
     <li>
       <strong>Instale também o <code>MySQL Workbench</code></strong><br>
       <a href="https://dev.mysql.com/downloads/workbench/" target="_blank">Baixar MySQL Workbench</a><br>
       O Workbench será usado para visualizar o schema e o diagrama do banco de dados.
     </li>
     <li>
       <strong>Instale o <code>Git Bash</code> (Windows) ou use o terminal (Linux/macOS)</strong><br>
       <a href="https://git-scm.com/downloads" target="_blank">Baixar Git</a><br>
       O Git Bash será usado para executar o script de automação.
     </li>
    </ul>  
  </li>
 
  <br>

  <li>
    <strong>Clone o repositório do projeto</strong><br>
    <pre><code>git clone https://github.com/luizaisok/Projeto-Cuidados-Paliativos.git
cd Projetos-Cuidados-Paliativos/scripts/sql/</code></pre>
  </li>
  
  <br>

  <li>
    <strong>Configure a senha do MySQL no script</strong><br>
    Abra o arquivo <code>run_db.sh</code> e edite a linha abaixo:
    <pre><code>MYSQL_PASS="SUA_SENHA_DO_ROOT"</code></pre>
  </li>
  
  <br>

  <li>
    <strong>No SO Windows: Adicione o MySQL ao PATH (se necessário)</strong><br>
    Se o comando <code>mysql</code> não for reconhecido no Git Bash:
    Adicione o caminho: <code>C:\Program Files\MySQL\MySQL Server 8.0\bin</code> às variáveis de ambiente do sistema.</li>
  </li>
  
  <br>

  <li>
    <strong>Habilite o carregamento de arquivos locais</strong><br>
    No arquivo de configuração do MySQL (<code>my.ini</code>), adicione:
    <pre><code>[mysqld]
local_infile=1</code></pre>
    Depois, reinicie o serviço MySQL (ou a máquina):
    <pre><code>net stop MySQL80
net start MySQL80</code></pre>
  </li>
  
  <br>

  <li>
    <strong>Execute o script de criação do banco de dados</strong><br>
    <pre><code>chmod +x run_db.sh
./run_db.sh</code></pre>
    Esse comando:
    <ul>
      <li>Cria o schema <code>cuidados_paliativos_db</code></li>
      <li>Cria todas as tabelas</li>
      <li>Popula o banco com os dados simulados dos arquivos CSVs</li>
    </ul>
  </li>
  <br>

  <li>
    <strong>Verifique o banco no MySQL Workbench</strong><br>
    <ul>
      <li>Abra o MySQL Workbench e conecte-se com o usuário <code>root</code>.</li>
      <li>No painel esquerdo, clique com o botão direito em <strong>Schemas</strong> → <strong>Refresh All</strong>.</li>
      <li>
       Abra uma nova aba SQL e execute as queries abaixo para testar:
       <pre><code>USE cuidados_paliativos_db;
SHOW TABLES;
SELECT * FROM pacientes LIMIT 5;</code></pre>
        Se o banco foi criado corretamente, você verá a lista de tabelas e algumas linhas da tabela <code>pacientes</code>.
      </li>
    </ul>
  </li>
</ol>

<h3>⚠️ Possíveis Erros e Soluções</h3>

<table>
  <tr>
    <th>Erro</th>
    <th>Causa</th>
    <th>Solução</th>
  </tr>
  <tr>
    <td><code>ERROR 3948: Loading local data is disabled</code></td>
    <td>O parâmetro <code>local_infile</code> está desativado</td>
    <td>Ative no arquivo <code>my.ini</code> e reinicie o MySQL</td>
  </tr>
  <tr>
    <td><code>mysql: command not found</code></td>
    <td>O MySQL não está no PATH</td>
    <td>Adicione o diretório <code>bin</code> do MySQL nas variáveis de ambiente</td>
  </tr>
  <tr>
    <td><code>ERROR 1045 (28000): Access denied</code></td>
    <td>Senha incorreta do usuário root</td>
    <td>Corrija a senha no arquivo <code>run_db.sh</code></td>
  </tr>
  <tr>
    <td><code>ERROR 1064 (42000): Syntax error</code></td>
    <td>Sintaxe incorreta no SQL ou caminho inválido</td>
    <td>Verifique se os caminhos para os CSVs estão corretos e entre aspas simples</td>
  </tr>
  <tr>
    <td><code>Port 3306 already in use</code></td>
    <td>Outra instância do MySQL está em execução</td>
    <td>Finalize a instância anterior ou altere a porta no arquivo <code>my.ini</code></td>
  </tr>
</table>


---


<h2>Contribuições</h2>
<p align="justify">Este projeto está aberto para contribuições via <i>issues</i>. Se você encontrou um <i>bug</i>, deseja sugerir uma melhoria ou tem dúvidas sobre o funcionamento, siga as instruções abaixo:</p>
<ol>
    <li>Verifique se já existe uma <i>issue</i> sobre o assunto. Caso sim, adicione um comentário nela.</li>
    <li>Se não houver, abra uma nova <i>issue</i> com uma descrição clara e objetiva.</li>
</ol>

---

## Licença e Autoria

Esse projeto está sendo dessenvolvido por [Luiza Mariana de Carvalho Martins](https://www.linkedin.com/in/luiza-mariana-dev/), [Matheus Ventura Nellessen](https://www.linkedin.com/in/dev-matheusvn/) e [Ana Carolina Aguiar Pereira](https://www.linkedin.com/in/ana-carolina-aguiar-pereira/); e está licenciado sob a licença `CC BY-NC-ND 4.0`. Visualize o [documento](./LICENSE) para mais informações.

<details>
<summary>Entenda a licença 👇</summary>

<br>

É permitido compartilhar o material, ou seja, copiar e redistribuir em qualquer suporte ou formato.  

As condições para esse uso são:  

- **Atribuição** — deve ser dado o devido crédito, incluindo um link para a licença e a indicação de possíveis alterações, de forma razoável e sem sugerir que os autores endossam o uso.  
- **Não Comercial** — o material não pode ser utilizado para fins comerciais.  
- **Sem Derivações** — não é permitido remixar, transformar ou criar a partir do material para redistribuição.  
- **Sem restrições adicionais** — não podem ser aplicados termos jurídicos ou medidas tecnológicas que impeçam ou restrinjam legalmente o que a licença já permite.  

</details>
