  export const writeFavNameData = name => {
    const db = getDatabase();
    const favRef = ref(db, 'favorites/' + name);
    set(favRef, {
      name,
      Likes: increment(1)
    });
  };
  
  const favoritesChanged = (snapshot) => {
    // TODO: clear #favoritesList
    snapshot.forEach(fav => {
      const childKey = fav.key;
      const childData = fav.val();
      console.log(childKey,childData);
      // TODO: update #favoritesList
    });
  };
  
  const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'favorites/');
    onValue(favoritesRef,favoritesChanged);
    
    /*
    btnSubmit.onclick = () => {
      writeFavNameData(nameField.value);
    };
    */
  };
  
  init();