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
  
  export const addFavorite = (str) => {
    const allValues = readLocalStorage();
  
    allValues.haikus.push(str);
    writeLocalStorage(allValues);
  };
  
  export const getFavorites = () => readLocalStorage().haikus;
  
  export const clearFavorites = () => {
    const allValues = readLocalStorage();
  
    allValues.haikus = [];
    writeLocalStorage(allValues);
  };
  