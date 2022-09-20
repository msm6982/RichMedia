const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<footer class="footer pt-1 pb-1 has-text-centered">By <span id="author">???</span> - &copy; <span id="year">???</span></footer>
`;

class CounterFooter extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes(){
    return ["data-author","data-year"];
  }

  attributeChangedCallback(name, oldValue, newValue){
    this.render();
  }

  connectedCallback(){
    this.render();
  }

  render(){
    const authorElement = this.shadowRoot.querySelector("#author");
    const yearElement = this.shadowRoot.querySelector("#year");
    authorElement.innerHTML = this.dataset.author || "No author provided";
    yearElement.innerHTML = this.dataset.year || "No year provided";
  }

} 

customElements.define('counter-footer', CounterFooter);