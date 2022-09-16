import {deleteCharacter} from './main.js'

const template = document.createElement("template");
template.innerHTML = `
<style>
div {
    height: 340px;
    width: 170px;
    border: 1px solid gray;
    padding: .5rem;
    background-color: #f4f4f4;
    overflow: auto;
    font-size: .7rem;
    position: relative
  }
  
h2 {
    font-size: 1.1rem;
    font-family: SfDistantGalaxy, sans-serif;
    letter-spacing: .67px;
    line-height: 1.2;
    margin-top: 0;
  }
  
img {
    width: 100px;
  }

button{
    border-radius: 1px;
    padding: 2px;
    position: absolute;
    top: 1px;
    right: 1px;
    opacity: 0.2;
}
button:hover {
    opacity: 1;
}

#swcMastersText {
    margin-block-end: .5em;
}
    

#swcMasters{
    padding-inline-start: 15px;
    margin-block-start: 0em;
    margin-block-end: 0em;
}

</style>
<div>
    <h2></h2>
    <button>X</button>
    <img alt="mugshot">
    <p id = "swcHeight">Height: </p>
    <p id = "swcMass">Mass: </p>
    <p id = "swcSpecies">Species: </p> 
    <p id = "swcMastersText">Masters: </p>
    <ul id="swcMasters">
    </ul>
</div>
`;

class SWCard extends HTMLElement{
    constructor(){
        super();

        this.attachShadow({mode:"open"});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
    }

    connectedCallback() {
        // Create span element and add it to shadow dom 
        
        this.h2 = this.shadowRoot.querySelector("h2");
        this.img = this.shadowRoot.querySelector("img");
        this.p1 = this.shadowRoot.querySelector("#swcHeight");
        this.p2 = this.shadowRoot.querySelector("#swcMass");
        this.p3 = this.shadowRoot.querySelector("#swcSpecies");
        this.button = this.shadowRoot.querySelector("button");
        this.list = this.shadowRoot.querySelector("#swcMasters");

        this.button.onclick = () => this.remove();

        this.render();
    }

    
    disconnectedCallback() {
        deleteCharacter(this);
        this.button.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal){ 
        //console.log(attributeName, oldVal, newVal);
        this.render();
    }

    

    static get observedAttributes(){
        return ["data-name", "data-height", "data-mass", "data-image", "data-species","data-masters"];
    }



    render() {
        const name  = this.getAttribute('data-name') ? this.getAttribute('data-name') : "<i>...character name...</i>";
        const height = this.getAttribute('data-height') ? this.getAttribute('data-height') : "0";
        const mass = this.getAttribute('data-mass') ? this.getAttribute('data-mass') : "0";
        const imageUrl = this.getAttribute('data-image') ? this.getAttribute('data-image') :  "images/catimage-no-image.png"
        const species = this.getAttribute('data-species') ? this.getAttribute('data-species') :  "unkown";
        let mastersList = this.getAttribute('data-masters') ? this.getAttribute('data-masters') :  "no one";
        //console.log(masters);
        let masterHtml = "";
        mastersList.split(",").forEach(m => { masterHtml += `<li>${m}</li>`; });

        if (this.h2) this.h2.innerHTML = `${name}`;
        if (this.p1) this.p1.innerHTML = `Height: ${height}`;
        if (this.p2) this.p2.innerHTML = `Mass: ${mass}`;
        if (this.p3) this.p3.innerHTML = `Species: ${species}`;
        if (this.list) this.list.innerHTML = masterHtml;
        if (this.img) this.img.src = imageUrl;
    }
}

customElements.define('sw-card', SWCard);
