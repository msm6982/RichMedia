

const template = document.createElement("template");
template.innerHTML = `
<style>

footer{
    color: white;
    background-color: black;
    padding: .5rem;
    margin-top: .5rem;
}

</style>

<footer>
&copy; 2021 Ace Coder
</footer>

`;

class SWFooter extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode:"open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    }

    connectedCallback() {
        // Create span element and add it to shadow dom 
        
        this.footer = this.shadowRoot.querySelector("footer");

        this.render();
    }

    render(){
        const footerText = this.dataset.footer ? this.dataset.footer : "Unknow attribute";
        if (this.footer) this.footer.innerHTML = `${footerText}`;
    }
}

customElements.define('sw-footer', SWFooter);