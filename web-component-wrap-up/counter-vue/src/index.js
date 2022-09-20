import createComponents from './components.js';

const app = Vue.createApp({});
createComponents(app);
app.mount("#app");