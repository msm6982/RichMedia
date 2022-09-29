const template = document.createElement("template");
template.innerHTML = `
<div class="hero-footer">My attribute</div>

`;

class HaikuFooter extends HTMLElement{
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

customElements.define('haiku-footer', HaikuFooter);