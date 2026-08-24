# ♿ Projeto D.I.A. – Desenvolvimento Inclusivo e Acessível

> Laboratório prático e escalável dedicado à implementação de padrões rigorosos de Acessibilidade Digital (A11Y), focado em Design Universal, controle de estado e aderência às diretrizes WCAG.

<table align="center">
        <tbody>
                <tr>
                        <td align="center" width="50%">
                                <figure>
                                        <img src="./assets/to_readme/layout_padrao.png" width="400" alt="Captura de tela mostrando o layout padrão da página sem ajustes de acessibilidade">
                                        <figcaption><strong>Versão Base (Padrão)</strong></figcaption>
                                </figure>
                        </td>
                        <td align="center" width="50%">
                                <figure>
                                        <img src="./assets/to_readme/layout_acessivel.png" width="400" alt="Captura de tela mostrando o modo de contraste universal ativado e o widget flutuante de acessibilidade visível">
                                        <figcaption><strong>Versão com Acessibilidade Ativa</strong></figcaption>
                                </figure>
                        </td>
                </tr>
        </tbody>
</table>

---

## 📖 Sobre o Projeto

O **Projeto D.I.A.** foi estruturado como uma **Central de Acessibilidade** robusta para oferecer controle total sobre a experiência de navegação. 

A proposta é demonstrar, em um ambiente Vanilla JS, como a arquitetura do código e a gestão de estado inteligente podem resolver conflitos de interface e criar um ambiente nativamente inclusivo para usuários videntes, usuários de leitores de tela e navegantes de teclado.

---

## 🎯 Problema

Na web moderna, a acessibilidade frequentemente esbarra em:

- Falta de opções de legibilidade para pessoas com dislexia ou baixa visão.
- Conflitos de contraste em implementações falhas de *Dark Mode* (Efeito Camuflagem).
- Barreiras de navegação por teclado (falta de *Skip Links* ou quebra de foco).
- Carga cognitiva excessiva devido a animações ininterruptas.
- Perda de configurações de acessibilidade ao recarregar a página.

---

## 💡 Solução

A Central de Acessibilidade atua como um **motor de renderização inclusivo**, capaz de:

- Inverter e aplicar paletas de cores validadas (Nível AAA).
- Alternar escalas tipográficas e famílias de fontes especializadas.
- Paralisar mídias e animações para reduzir sobrecarga sensorial.
- Proteger o fluxo de navegação por teclado (Focus Trap).
- Persistir as preferências do usuário na memória do navegador.

---

## 🏗️ Arquitetura Conceitual

```text
Usuário (Mouse / Teclado / Leitor de Tela)
   │
   ▼
Widget Flutuante Universal
   │
   ├── Motor de CSS Variables (Temas)
   ├── Controle Tipográfico (Escala Rem)
   ├── Filtros Sensoriais (Animações/Mídia)
   └── Gerenciador de Conflitos de UX
   │
   ▼
[ LocalStorage API ] ──► Persistência de Estado
   │
   ▼
Interface Renderizada e Acessível

🧠 Pilares Técnicos
A camada de acessibilidade é dividida em módulos focados em responsabilidade única:

UI & Navegação
Widget Flutuante: Uso da tag <aside> para um painel lateral persistente, utilizando o Símbolo de Acessibilidade Universal da ONU.

Skip Link Oculto: Aplicação da técnica Visually Hidden. O link intercepta o primeiro Tab da página para pular o cabeçalho, tornando-se visível apenas quando focado.

Modal Semântico: Implementado com a tag <dialog>, garantindo isolamento nativo (Focus Trap) e escurecimento do fundo com ::backdrop.

Gestão de Estilos (CSS)
Manipulação global no :root via atributo data-theme.

Prevenção de Camuflagem: Regras rigorosas de inversão de cor em botões primários durante a ativação do Modo Escuro.

Persistência e Estado (JS)
Motor centralizado de getState() e saveState() comunicando-se com o localStorage.

Função de Reset Absoluto (removeItem) para limpeza limpa de cache, simulando uma visita inédita.

🌳 Lógica de Resolução de Conflitos
O mecanismo do projeto utiliza uma árvore de decisão para evitar sobreposição de regras conflitantes na interface.

[Input do Usuário: Slider de Fonte]
        │
        ▼
┌─────────────────────────────┐
│ 1. Verificação de Estado    │
└─────────────────────────────┘
O estado atual possui o botão de 
"Alta Visibilidade" ativado?

        │
        ├──► Não:
        │    Atualiza a variável CSS da fonte.
        │
        └──► Sim:
             Desativa o botão "Alta Visibilidade" 
             visualmente e no LocalStorage.

        │
        ▼
┌─────────────────────────────┐
│ 2. Sincronização Geral      │
└─────────────────────────────┘
Salva o novo estado e despacha a 
atualização para o DOM.

Essa abordagem garante que ajustes granulares (como um controle deslizante) assumam prioridade sobre atalhos rápidos, mantendo a consistência (Única Fonte de Verdade).

🧪 Cenários de Validação (Testes)
Para garantir a eficiência da ferramenta, as seguintes validações foram aplicadas:

Cenário 1 – Navegação Inclusiva (Teclado)
Ação: Usuário navega exclusivamente com a tecla Tab.
Resultado: O foco revela o Skip Link, passa suavemente pelos controles do Widget Flutuante e, ao abrir a Central, fica "preso" dentro do Modal até ser fechado com Esc ou pelo botão nativo.

Cenário 2 – Carga Cognitiva
Ação: Ativação do modo "Reduzir Distrações".
Resultado: O CSS injeta variáveis que pausam animation-play-state, desativam transições abruptas e aplicam filtro sépia em todas as imagens (ex: pratos de comida) para estabilidade visual.

📁 Estrutura do Projeto
PROJETO_DIA_A11Y/

├── assets/
│   ├── css/
│   │   ├── accessibility.css
│   │   ├── reset.css
│   │   ├── style.css
│   │   └── variables.css
│   └── to_readme/
│       ├── acessibilidade_isa.png
│       ├── layout_padrao.png
│       └── layout_acessivel.png
│
├── scripts/
│   ├── accessibility-state.js
│   ├── accessibility-ui.js
│   └── index.js
│
├── index.html
└── README.md

Acessibilidade e Inclusão
Este projeto não apenas apresenta configurações, mas é construído sob boas práticas rígidas:

HTML 100% semântico e estruturado.

Forte aplicação de atributos WAI-ARIA (aria-expanded, aria-pressed, aria-haspopup, role="switch").

Contraste validado em níveis WCAG AA e AAA.

Preparação de affordance visual (espaçamento de clique, contornos de foco espessos).

🚀 Próximas Evoluções
Implementação do motor de voz (Text-to-Speech) integrado à Web Speech API.

Integração de avatar tradutor de Libras (VLibras).

Refatoração da lógica de Vanilla JS para componentização em React.

Criação de testes automatizados com Cypress e axe-core.

📄 Licença
Projeto desenvolvido como laboratório contínuo de Acessibilidade Digital e boas práticas de Front-End.

👨‍💻 Autor
Ricardo Werner

Desenvolvedor Front-End, unindo acessibilidade, inclusão digital e UX a 30+ anos de vivência em Gestão e Negócios corporativos.