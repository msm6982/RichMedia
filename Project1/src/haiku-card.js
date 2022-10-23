const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
.card{
  height:200px;
  overflow: auto;
}
</style>

<div class = "card">

    <!-- Haiku Text -->
    <div class = "is-italic has-text-centered">
      <h2 id="line1"></h2> 
      <h2 id="line2"></h2> 
      <h2 id="line3"></h2> 
    </div>

    <!-- favorites -->
    <br>
    <div class="control has-text-centered">
    <button id="fav-btn" class="button is-primary is-small" title="Favorite this Haiku!">Favorite!</button>
    </div>
</div>


`;

class HaikuResultsCard extends HTMLElement{
  constructor () {
    super();
    this.attachShadow({"mode":"open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    
    this.shadowRoot.querySelector("#line1").innerHTML = this.dataset.line1;
    this.shadowRoot.querySelector("#line2").innerHTML = this.dataset.line2;
    this.shadowRoot.querySelector("#line3").innerHTML = this.dataset.line3;

    this.btnFavorite = this.shadowRoot.querySelector("#fav-btn");
    this.callback = this.callback || ((obj) => console.log(`Haiku Line1: ${obj.line1}, Line2: ${obj.line2}, Line3: ${obj.line3}`));
    this.setButtonStyle();
    
    this.btnFavorite.onclick = (e) => {
      // Add to favorites 
      this.dataset.addedToFavorites = (this.dataset.addedToFavorites == "false") ?  true : false;
      
      /*
      if(this.dataset.addedToFavorites == "false"){
        
        this.dataset.addedToFavorites = true;
        this.setButtonStyle();
      }
      // Remove from favorites
      else {
        this.dataset.addedToFavorites = false;
        
       
      }
      */
      this.setButtonStyle();
      const dataObj = {
      "line1" : this.dataset.line1,
      "line2" : this.dataset.line2,
      "line3" : this.dataset.line3,
      "addedToFavorites" : this.dataset.addedToFavorites
      };

      this.callback(dataObj);
    };
  }

  setButtonStyle() {
    this.dataset.addedToFavorites == "false" ? this.unFavoritedHaikuBtn() : this.favoritedHaikuBtn();
  }

  favoritedHaikuBtn() {
    this.btnFavorite.innerHTML = "Favorited!"
    this.btnFavorite.classList.remove('is-primary');
    this.btnFavorite.classList.add('is-warning');
  }

  unFavoritedHaikuBtn() {
    this.btnFavorite.innerHTML = "Favorite!"
    this.btnFavorite.classList.remove('is-warning');
    this.btnFavorite.classList.add('is-primary');
  }
  

  disconnectedCallback(){
    this.btnFavorite.onclick = null;
  }
}

customElements.define("haiku-card", HaikuResultsCard);