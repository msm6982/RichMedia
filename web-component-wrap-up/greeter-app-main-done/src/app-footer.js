const template = document.createElement("template");
template.innerHTML = `
<style>
footer{
  user-select: none;
  cursor: pointer;
}
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<footer class="footer p-1 has-background-grey-lighter has-text-dark">
  <div class="content has-text-centered">
    <p>
      <strong>Greeter</strong> by Ace Coder
    </p>
  </div>
</footer>
`;

class AppFooter extends HTMLElement{
  constructor(){
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  
  connectedCallback(){
    this.count = 0; 
    this.onclick = e => {
      this.count++; 
      this.render();
    };
    this.render();
  }

  disconnectedCallback(){
    this.onclick = null;
  }

  render(){
    const text = this.dataset["text"] || "Nobody";
    this.shadowRoot.querySelector("p").innerHTML = `<b>Greeter</b> by ${text} - click count = ${this.count}`;
  }
} 

customElements.define('app-footer', AppFooter);