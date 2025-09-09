## Projeto Acadêmico sobre Cuidados Paliativos

Este aplicativo foi desenvolvido com finalidade acadêmica e tem como objetivo auxiliar pacientes em cuidados paliativos e seus cuidadores, oferecendo informações, orientações e recursos que possam contribuir para a melhoria da qualidade de vida nesse processo.

### Funcionalides Principais
- Organização de informações de saúde.
- Interface simples e acessível.

### Público-alvo
- Pacientes em cuidados paliativos.
- Familiares e cuidadores.

---

# Acolvita

O projeto consiste em um aplicativo mobile voltado ao monitoramento do bem-estar de pacientes em cuidados paliativos, oferecendo recursos que promovem qualidade de vida, segurança e comunicação entre pacientes, familiares e médicos.

* Público-alvo: pacientes em cuidado paliativos, familiares e médicos. 

## MVP ─ Principais Funcionalidades

1. Monitoramento do bem-estar
* Usuário acessará um checklist/pop-up para informar sintomas (ex.: dor de cabeça, enjoo).  
* O sistema calculará um score e exibirá uma cor indicativa:  
  * 🟢 **Verde:** condição estável.  
  * 🟡 **Amarelo:** atenção necessária.  
  * 🔴 **Vermelho:** situação crítica com recomendação de procurar ajuda médica.  

2. Prontuário do paciente
* Campos definidos: ....  
* **Pendência**: decisão futura sobre exportação dos dados ou integração com sistemas de hospitais/unidades de saúde.  

<br>

| Funcionalidade         | Status                       | Descrição                                                              |
| ---------------------- | ---------------------------- | ---------------------------------------------------------------------- | 
| Checklist de bem-estar | ✅ Implementado (front-end) | Paciente acessa um checklist para informar sintomas                    |
| Prontuário             | ✅ Implementado (front-end) | Histórico de saúde disponível para paciente, familiar e médico         |
| Cálculo de Score       | 🚧 Em desenvolvimento       | O sistema calculará um score e exibirá uma cor indicativa              |

Para visualizar ou baixar a ATA, clique [aqui](https://drive.google.com/file/d/1JC6Judmnn5hLDE83iDCCX8FW-K4gy_4-/view?usp=sharing).

## Prototipação (Front-end)

Com base na prototipação de autofidelização do cliente, desenvolvemos nossa versão no Figma, que foi aprovada (pelo cliente) e atende aos requisitos de usabilidade e experiência do usuário.

<div style="display: flex; gap: 10px; flex-wrap: wrap;">
  <img src="./img/loading.png" alt="Protótipo Loading Figma" height="500px">
  <img src="./img/login.png" alt="Protótipo Login Figma" height="500px">
  <img src="./img/cadastro.png" alt="Protótipo Cadastro Figma" height="500px">
  <img src="./img/checklist.png" alt="Protótipo Checklist Figma" height="500px">
  <img src="./img/inicio.png" alt="Protótipo Início Figma" height="500px">
  <img src="./img/prontuario.png" alt="Protótipo Prontuário Figma" height="500px">
  <img src="./img/sinais-sintomas.png" alt="Protótipo Sinais e Sintomas Figma" height="500px">
  <img src="./img/atencao-verde.png" alt="Protótipo Atenção Cor Verde Figma" height="500px">
  <img src="./img/atencao-amarelo.png" alt="Protótipo Atenção Cor Amarelo Figma" height="500px">
  <img src="./img/atencao-vermelho.png" alt="Protótipo Atenção Cor Vermelho Figma" height="500px">
</div><br>

Para melhor visualização, acesse: [www.figma.com/design/TV10wmTPGYcn2YrZ2m6sq5/Cuidados-Paliativos?node-id=0-1&p=f&t=jpLFSH9he5UH76jH-0](https://www.figma.com/design/TV10wmTPGYcn2YrZ2m6sq5/Cuidados-Paliativos?node-id=0-1&p=f&t=jpLFSH9he5UH76jH-0).

## Modelagem UML

* ### Casos de Uso

<img src="./img/caso-de-uso.jpeg" alt="Diagrama de Caso de Uso" height="700px"><br>

<details>
    <summary><strong>Paciente</strong></summary>
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
    <summary><strong>Parente</strong></summary>
    <ul>
      <li>Realizar cadastro</li>
      <li>Acessar o status de sintoma</li>
      <li>Acessar dados de familiares</li>
      <li>Acessar a sessão de dúvidas</li>
    </ul>
  </details>

  <details>
    <summary><strong>Administrador</strong></summary>
    <ul>
      <li>Acessar os dados do paciente</li>
      <li>Visualizar prontuário</li>
      <li>Acessar a sessão de hospitais</li>
      <li>Editar cadastro de usuário</li>
      <li>Excluir usuário</li>
    </ul>
  </details>

  ## Arquitetura do Projeto

  <pre><code>
cuidados_paliativos/
├─ .cursor/
├─ .expo/
├─ android/
├─ ios/
├─ node_modules/
├─ src/
│  ├─ assets/
│  │  └─ TextoPadrao.js
│  ├─ components/
│  │  ├─ Footer/
│  │  │  └─ index.js
│  │  ├─ Header/
│  │  │  └─ index.js
│  │  └─ ListaSintomas/
│  │     └─ index.js
│  ├─ data/
│  │  ├─ paciente.js
│  │  └─ sintomas.js
│  ├─ img/
│  └─ pages/
│     ├─ Duvidas.js
│     ├─ MenuSintomas.js
│     └─ PerfilProntuario.js  # isso faz aquilo e bla bla bla...

├─ .gitattributes
├─ .gitignore
├─ App.js 
├─ app.json
├─ index.js
├─ metro.config.js
├─ package-lock.json
├─ package.json
├─ img/
├─ package-lock.json
└─ README.md
</code></pre><br>

<!-- Meninas, tem que por o que cada coisa faz, mas hoje estou cansado... -->

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

# 3. Instalar dependências

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

<!-- ACHO QUE È ISSO MENINAS -->
