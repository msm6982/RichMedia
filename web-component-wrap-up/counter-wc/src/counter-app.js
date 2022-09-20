/*
  Counter - Web Components Version
  Advantages: 
    1) Good browser compatibility because Web Components are technically "Vanilla"
    2) No 3rd-party dependencies means that the code won't be obsolete for a long time
    3) Web components are easily reused between projects
    4) Web Components have a shadow DOM and their own encapsulated state, which makes debugging easier
    5) Web Components are in separate files which makes it easier for multiple developers to work on the same app at the same time
    6) Updates/maintenance/testing is easier because components are in separate files
    7) A self-contained application - easy to reuse - even on the same page!
  Disadvantages:
    1) Web Components are relatively new so older browsers won't support them without a polyfill
    2) Web Components have a lower adoption rate at this time than Angular/React/Vue
    3) You have to write more code to use Web Components than you do with VanillaJS
*/


import "./counter-header.js";
import "./counter-footer.js";

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<counter-header></counter-header>
<main class="container is-info m-2">
  <button id="btn-minus" class="button is-large is-warning">-1</button>
  <button id="btn-plus" class="button is-large is-primary">+1</button>
  <span id="output" class="is-size-2 ml-2">Count: ??</span>
</main>
<counter-footer></counter-footer>
`;

class CounterApp extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback(){
    this.count = 0;
    this.output = this.shadowRoot.querySelector("#output");
    this.btnMinus = this.shadowRoot.querySelector("#btn-minus");
    this.btnPlus = this.shadowRoot.querySelector("#btn-plus");
    this.btnMinus.onclick = () => {
      this.count -= 1;
      this.updateOutput();
    };
    this.btnPlus.onclick = () => {
      this.count += 1;
      this.updateOutput();
    };
    this.render();
  }

  disconnectedCallback(){
    this.btnMinus.onclick = null;
    this.btnPlus.onclick = null;
  }

  updateOutput(){
    this.output.innerHTML = `Count: ${this.count}`;
  }

  render(){
    const header = this.shadowRoot.querySelector("counter-header");
    header.dataset.title = this.dataset.title || "Need data-title";
    header.dataset.subtitle = this.dataset.subtitle || "Need data-subtitle";
 
    const footer = this.shadowRoot.querySelector("counter-footer");
    footer.dataset.author = this.dataset.author || "Need data-author";
    footer.dataset.year = this.dataset.year || "Need data-year";
    
    this.updateOutput();
  }
} 

customElements.define('counter-app', CounterApp);