const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
    display: block;
    background-color: #ddd;
}
span{
    color: #F76902;
    font-variant: small-caps;
    font-weight: bolder;
    font-family: sans-serif;
}
</style>
<span></span>
<hr>
`;


class IGMFooter extends HTMLElement{
    constructor(){
      super();
      // attach a shadow DOM tree to this instance
      this.attachShadow({mode:"open"});

      // Create span element and add it to shadow dom 
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(){
        this.render();
    }

    render(){
        console.log(this.attributes['data-year'].value);
        const year = this.attributes['data-year'].value ? this.attributes['data-year'].value : "1995";
        const text = this.attributes['data-text'].value ? this.attributes['data-text'].value : "Nobody";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${text}`;
    }
  } 
	
  customElements.define('igm-footer', IGMFooter);