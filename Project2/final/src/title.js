const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<p class="title m-1 has-text-white has-text-weight-bold">PlaceHolderTitle</p>
<p class="subtitle m-1 has-text-white">PlaceholderSubtitle</p>
`;

// Title Web componet for title/header text on pages
class PageTitle extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode:"open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    }

    connectedCallback() {
        // Create span element and add it to shadow dom 
        
        this.title = this.shadowRoot.querySelector(".title");
        this.subtitle = this.shadowRoot.querySelector(".subtitle");

        this.render();
    }

    render(){
        const titleText = this.dataset.title ? this.dataset.title : "Paceholder Title";
        const subtitleText = this.dataset.subtitle ? this.dataset.subtitle : "";
        if (this.title) this.shadowRoot.querySelector(".title").innerHTML = `${titleText}`;
        if (this.subtitle) this.subtitle.innerHTML = `${subtitleText}`;
    }
}

customElements.define('page-title', PageTitle);