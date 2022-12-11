const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div class="hero-footer has-text-centered has-text-white has-text-weight-bold has-background-warning pt-3 pb-3">My attribute</div>

`;
// Web Componet that contains footer infomation
class PageFooter extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode:"open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    }

    connectedCallback() {
        // Create span element and add it to shadow dom 
        
        this.footer = this.shadowRoot.querySelector(".hero-footer");

        this.render();
    }

    render(){
        const footerText = this.dataset.footer ? this.dataset.footer : "Unknow attribute";
        if (this.footer) this.footer.innerHTML = `${footerText}`;
    }
}

customElements.define('page-footer', PageFooter);