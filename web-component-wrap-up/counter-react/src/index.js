/*
  Counter - React Version
  Advantages: 
    1) React has the #1 market share among web frameworks right now and a large developer ecosystem
    2) Components are easily reused between projects
    3) React syntax is much less verbose than Web Component syntax
    4) React components have their own encapsulated state, which makes debugging easier
    5) React components can be in separate files which makes it easier for multiple developers to work on the same app at the same time
    6) React has built-in data-binding features that Web Components do not have
    7) Updates/maintenance/testing is easier because components are in separate files
    8) A self-contained application - easy to reuse - even on the same page!
    Disadvantages:
    1) React is proprietary tech (owned my Meta) and changes frequently
    2) This means more times where you might have to update the code, and a much shorter lifetime for your app
    3) Production React code requires transpilation before it can be delivered to the web 
    4) More debugging will be required as React adds whole new classes of possible errors to your code
*/

ReactDOM.render(
  <App title="Reactive Counter" subtitle="React CDN Version" author="Ace Coder" year="2022" />,
  document.querySelector('#root')
);

// ReactDOM.render(
//   <div>
//     <App title="Reactive Counter" subtitle="React CDN Version" author="Ace Coder" year="2022" />
//     <App title="Another Reactive Counter with its own state" subtitle="Keep track of something" author="Ima Student" year="2021" />
//   </div>,
//   document.querySelector('#root')
// );