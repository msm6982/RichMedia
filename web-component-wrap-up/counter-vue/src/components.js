const createComponents = (app) => {
  app.component('app-heading', {
    props: ["title","subtitle"],
    template: `
    <header class="hero is-info">
      <div class="hero-body">
        <h1 class="title">{{title}}</h1>
        <h2 class="subtitle">{{subtitle}}</h2>
      </div>
    </header>`
  });

  app.component('app-footer', {
    props: ["author","year"],
    template: `
      <footer class="footer pt-1 pb-1 has-text-centered">
      By 
      <span>{{author}}</span> - &copy; 
      <span>{{year}}</span>
      </footer>`
  });

  app.component('app-main', {
    props: ["title","subtitle","author","year"],
    data() {
      return {
        count: 0
      }
    },
    methods: {
      decrement(){
        this.count -= 1;
      },
      increment(){
        this.count += 1;
      }
    },
    template: `
      <div>
        <app-heading :title="title" :subtitle="subtitle"></app-heading>
        <main class="container is-info m-2">
          <button @click="decrement" class="button is-large is-warning mr-1">-1</button>
          <button @click="increment" class="button is-large is-primary mr-2">+1</button>
          <span id="output" class="is-size-2 ml-2">Count: {{this.count}}</span>
        </main>
        <app-footer :author="author" :year="year"></app-footer>
      </div>`
  });
};

export default createComponents;