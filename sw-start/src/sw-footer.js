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
        
    }

    connectedCallback() {
        // Create span element and add it to shadow dom 
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.footer = this.shadowRoot.querySelector("footer");

        this.render();
    }

    disconnectedCallback() {
        this.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal){ 
        //console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes(){
        return ["data-footer"];
    }

    render(){
        const footerText = this.dataset.footer ? this.dataset.footer : "Unknow attribute";
        this.footer.innerHTML = `${footerText}`;
    }
}

customElements.define('sw-footer', SWFooter);