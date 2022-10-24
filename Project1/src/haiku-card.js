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
    <div class= "control has-text-centered">
    <button id="fav-btn" class="button is-primary is-medium" title="Favorite this Haiku!">Favorite!</button>
    <p id = "likes-counter" class = "is-size-5 mt-2"></p>
    </div>
</div>


`;

// Haiku Card, what's displayed for home, app, favorites, and community
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

    this.shadowRoot.querySelector("#likes-counter").innerHTML = (this.dataset.likes != null) ? `Total Likes: ${this.dataset.likes}` : "";
    

    this.btnFavorite = this.shadowRoot.querySelector("#fav-btn");
    this.callback = this.callback || ((obj) => console.log(`Haiku Line1: ${obj.line1}, Line2: ${obj.line2}, Line3: ${obj.line3}`));
    this.setButtonStyle();
    
    
    // Returns object from connected callback
    this.btnFavorite.onclick = (e) => {
      // Add to favorites 
      this.dataset.addedToFavorites = (this.dataset.addedToFavorites == "false") ?  true : false;
      
      this.setButtonStyle();
      // Update the likes of the card if the button was pushed
      if (this.dataset.likes != null)
      {
        (this.dataset.addedToFavorites == "false") ? this.dataset.likes-- : this.dataset.likes++;
        this.shadowRoot.querySelector("#likes-counter").innerHTML = `Total Likes: ${this.dataset.likes}`;
      }
      const dataObj = {
      "line1" : this.dataset.line1,
      "line2" : this.dataset.line2,
      "line3" : this.dataset.line3,
      "addedToFavorites" : this.dataset.addedToFavorites
      };

      this.callback(dataObj);
    };
  }

  // Update the botton's style on favorite and unfavorite
  setButtonStyle() {
    this.dataset.addedToFavorites == "false" ? this.unFavoritedHaikuBtn() : this.favoritedHaikuBtn();
  }

  // Toggle favorited
  favoritedHaikuBtn() {
    this.btnFavorite.innerHTML = "Favorited!"
    this.btnFavorite.classList.remove("is-outlined");
    //this.btnFavorite.classList.remove('is-primary');
    //this.btnFavorite.classList.add('is-warning');

    
  }

  // Un favorite
  unFavoritedHaikuBtn() {
    this.btnFavorite.innerHTML = "Favorite!"
    this.btnFavorite.classList.add("is-outlined");
    //this.btnFavorite.classList.remove('is-warning');
    //this.btnFavorite.classList.add('is-primary');
  }
  

  disconnectedCallback(){
    this.btnFavorite.onclick = null;
    this.btnFavorite.onmouseover = null;
    this.btnFavorite.onmouseout = null;
  }
}

customElements.define("haiku-card", HaikuResultsCard);