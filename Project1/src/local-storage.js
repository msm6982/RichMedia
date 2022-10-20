/* Checked by ESLint - https://eslint.org/demo */
const defaultData = {
    "haikus": []
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
  
  export const clearLocalStorage = () => writeLocalStorage(defaultData);
  
  export const removeFavorite = (str) => {
    const allValues = readLocalStorage();

    const haikuObj = {
      "line1" : str.line1,
      "line2" : str.line2,
      "line3" : str.line3,
      };

    allValues.haikus.pop();
    //if (index > -1)  allValues.haikus.splice(index, 1); 
    
    writeLocalStorage(allValues);
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
  
  export const getFavorites = () => readLocalStorage().haikus;
  
  export const clearFavorites = () => {
    const allValues = readLocalStorage();
  
    allValues.haikus = [];
    writeLocalStorage(allValues);
  };
  