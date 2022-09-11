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
<span></span><span id="org"></span>
<hr>
`;




class IGMFooter extends HTMLElement{
    constructor(){
      super();
      // attach a shadow DOM tree to this instance
      this.attachShadow({mode:"open"});

      
    }


    

    connectedCallback(){
        // Create span element and add it to shadow dom 
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.render();
    }

    

    render(){
        const year = this.getAttribute('data-year') ? this.getAttribute('data-year') : "1995";
        const text = this.getAttribute('data-text') ? this.getAttribute('data-text') : "Nobody";
        const org = this.getAttribute('data-organization') ? this.getAttribute('data-organization') : "RIT";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${text}`;
        this.shadowRoot.querySelector("#org").innerHTML = `, Organization: ${org}`;
    }
  } 
	
  customElements.define('igm-footer', IGMFooter);