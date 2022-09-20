// I. React Function Component - "Simple" version
// Sometimes called an FSC - "Functional Stateless Component"
// Basically, a function that returns JSX (React's HTML variant)
// https://reactjs.org/docs/components-and-props.html
// https://www.jackfranklin.co.uk/blog/functional-stateless-components-react/
// Note below how `class` is now `className`
// Also note the data-binding syntax with {}

const AppHeader = props => {
  return (
    <header className="hero is-info">
      <div className="hero-body">
        <h1 className="title">{props.title}</h1>
        <h2 className="subtitle">{props.subtitle}</h2>
      </div>
    </header>
  );
};

// II. Ditto - a "one-liner" FSC with no state
const AppFooter = props => <footer className="footer pt-1 pb-1 has-text-centered">By <span>{props.author}</span> - &copy; <span>{props.year}</span></footer>;

// III. React class component
// https://reactjs.org/docs/react-component.html
// Unlike FSCs above, these let you maintain *state*
// in this case a `count` property
// Class components work fine, but newer projects often use *React Hooks* instead
// https://reactjs.org/docs/hooks-intro.html
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {count: 0};
  }
  decrement = () => {
    this.setState({count: this.state.count - 1});
  }

  increment = () => {
    this.setState({count: this.state.count + 1});
  }

  // IV. Note that we got rid of the ids for the buttons and the span
  // and are instead using the data-binding syntax on the <span>
  // and inline `onClick` React camel-cased event handlers for the buttons
  render(){
    return (
      <React.Fragment> {/* React requires component HTML to have a root element */}
        <AppHeader title={this.props.title} subtitle={this.props.subtitle} />
        <main className="container is-info m-2">
          <button onClick={this.decrement} className="button is-large is-warning mr-1">-1</button>
          <button onClick={this.increment} className="button is-large is-primary mr-2">+1</button>
          <span className="is-size-2 ml-2">Count: {this.state.count}</span>
        </main>
        <AppFooter author={this.props.author} year={this.props.year} />
      </React.Fragment>
    );
  }
}