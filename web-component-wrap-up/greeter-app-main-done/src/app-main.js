import { formatGreeting } from "./utils.js";
import "./app-footer.js";
import "./app-header.js";

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
  #output span{
    margin-left: 5px;
    display: inline-block;
  }
  #output{
    cursor: pointer;
  }
</style>
<app-header>
  <span slot="my-title">Greeter</span>	
  <span slot="my-subtitle">Web Components - <kbd>&lt;app-main></kbd> Version</span>
</app-header>
<nav class="navbar">
  <div class="navbar-brand">
    <a class="navbar-item">
      <span class="icon">
        <i class="fas fa-handshake"></i>
      </span>
    </a>

    <a class="navbar-burger">
      <span></span>
      <span></span>
      <span></span>
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start">
      <a class="navbar-item">
        Home
      </a>

      <a class="navbar-item has-text-weight-bold">
        App
      </a>
    </div>
  </div>
</nav>

<main>
  <div class="section has-background-light">	
    <div class="container mb-2">
      <button id="btn-hello" class="button is-primary is-medium" title="Say hello">
        <span class="icon">
          <i class="fas fa-handshake"></i>
        </span>
        <span>Hello</span>
      </button>
      <button id="btn-goodbye" class="button is-warning is-medium" title="Say goodbye">
        <span class="icon">
          <i class="fas fa-sign-out-alt pr-3"></i>
        </span>
        <span>Goodbye</span>
      </button>
      <span class="field">
        <input id="input-firstname" class="input is-medium" style="width:33%" type="text" placeholder="Type in your name">
      </span>
    </div>
    <div class="container">
      <input type="checkbox" id="cb-forcefully" class="checkbox">
      <label for="cb-forcefully"> Forcefully</label>
    </div>
  </div>

  <div class="section has-background-light">
    <div id="output" class="container has-text-weight-bold pb-3">
      Instructions: Type in your name and click one of the buttons!
    </div>	
  </div>
</main>

<app-footer data-text="Ace Coder"></app-footer>
`;

class AppMain extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback(){
    this.input = this.shadowRoot.querySelector("#input-firstname");
    this.output = this.shadowRoot.querySelector("#output");
    this.cbForcefully = this.shadowRoot.querySelector("#cb-forcefully");

    this.helloButton = this.shadowRoot.querySelector("#btn-hello");
    this.goodbyeButton = this.shadowRoot.querySelector("#btn-goodbye");

    this.forcefully = this.cbForcefully.checked;

    this.cbForcefully.onchange = e => {
      this.forcefully = e.target.checked;
    };

    this.helloButton.onclick = () => {
      this.output.innerHTML = formatGreeting("Hello",this.input.value.trim(),this.forcefully);
    };

    this.goodbyeButton.onclick = () => {
      this.output.innerHTML = formatGreeting("Goodbye",this.input.value.trim(),this.forcefully);
    };
  }

  disconnectedCallback(){
    this.cbForcefully.onchange = null;
    this.helloButton.onclick = null;
    this.goodbyeButton.onclick = null;
  }
} 

customElements.define('app-main', AppMain);