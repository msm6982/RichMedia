/* Checked by ESLint - https://eslint.org/demo */
const template = document.createElement("template");

template.innerHTML = `
<link 
  rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"
>
<div class="footer has-text-dark has-text-centered py-2"><slot></slot></div>
`;

class HotdogFooter extends HTMLElement {
  constructor (){
      super();
      this.attachShadow({"mode": "open"});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("hotdog-footer", HotdogFooter);
