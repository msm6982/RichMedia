const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<header class="hero is-info">
  <div class="hero-body">
    <h1 class="title">???</h1>
    <h2 class="subtitle">???</h2>
  </div>
</header>
`;

class CounterHeader extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes(){
    return ["data-title","data-subtitle"];
  }

  attributeChangedCallback(name, oldValue, newValue){
    this.render();
  }

  connectedCallback(){
    this.render();
  }

  render(){
    const titleElement = this.shadowRoot.querySelector(".title");
    const subtitleElement = this.shadowRoot.querySelector(".subtitle");
    titleElement.innerHTML = this.dataset.title || "No title provided";
    subtitleElement.innerHTML = this.dataset.subtitle || "No subtitle provided";
  }
} 

customElements.define('counter-header', CounterHeader);