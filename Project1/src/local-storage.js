/* Checked by ESLint - https://eslint.org/demo */
const defaultData = {
    "haikus": [],
    // Saved search terms from app page
    "savedSearch" : " ",
    "numeralInput" : "1",
    "uiState" : "Type a phrase and click the <b>Search</b> button to view Haikus",
    "recentlySearchedHaikus" : []
  },
  storeName = "msm6982-p1-settings"; 
  
  const readLocalStorage = () => {
    let allValues = null;
  
    try{
      allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
    }catch(err){
      console.log(`Problem with JSON.parse() and ${storeName} !`);
      throw err;
    }
  
    return allValues;
  };
  
  const writeLocalStorage = (allValues) => {
    localStorage.setItem(storeName, JSON.stringify(allValues));
  };
  



  // Save the current state of the app page, only overriden when the user searches correctly 
  export const saveAppState = (savedSearch, numeralInput, uiState, recentlySearchedHaikus) => 
  {
    let allValues = readLocalStorage();

    allValues.savedSearch = savedSearch;
    allValues.numeralInput = numeralInput;
    allValues.recentlySearchedHaikus = recentlySearchedHaikus;
    allValues.uiState = uiState;

    writeLocalStorage(allValues);
  }
  

  export const removeFavorite = (str) => {
    const allValues = readLocalStorage();

    allValues.haikus.pop();
    
    writeLocalStorage(allValues);
  }

  // Check if a haikus is in the favorites
  export const findHaikuInFav = (line1, line2, line3) =>
  {
    return readLocalStorage().haikus.includes({
      "line1" : line1,
      "line2" : line2,
      "line3" : line3,
      });
  }

  export const addFavorite = (str) => {
    const allValues = readLocalStorage();
    const haikuObj = {
      "line1" : str.line1,
      "line2" : str.line2,
      "line3" : str.line3,
      };
  
    allValues.haikus.push(haikuObj);
    writeLocalStorage(allValues);
  };

  export const getSavedSearch = () => readLocalStorage().savedSearch;

  export const getSavedNumeralInput = () => readLocalStorage.numeralInput;

  export const getSavedUI = () => readLocalStorage().uiState;

  export const getRecentlySearchedHaikus = () => readLocalStorage().recentlySearchedHaikus;

  export const clearLocalStorage = () => writeLocalStorage(defaultData);

  
  export const getFavorites = () => readLocalStorage().haikus;
  
  export const clearFavorites = () => {
    const allValues = readLocalStorage();
  
    allValues.haikus = [];
    writeLocalStorage(allValues);
  };
  