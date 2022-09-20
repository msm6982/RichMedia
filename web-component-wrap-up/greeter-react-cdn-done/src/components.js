const AppHeader = (props) => {
  return (
    <header className="hero is-small is-primary is-bold">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{props.title || "No title provided"}</h1>
          <h2 className="subtitle">{props.subtitle || "No subtitle provided"}</h2>
        </div>
      </div>
    </header>
  );
};

class AppFooter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({count: this.state.count + 1});
  }

  render(){ 
    return (
      <footer className="footer p-1 has-background-grey-lighter has-text-dark">
        <div className="content has-text-centered">
          <p onClick={this.increment}>
            <strong>Greeter</strong> by {this.props.text || "???"} - click count = {this.state.count}
          </p>
        </div>
      </footer>
    );
  }
};

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input: "",
      forcefully: "",
      greeting: "Instructions: Type in your name and click one of the buttons!"
    };
  }

  defaultName = "Mr. X";

  formatGreeting = (greeting, name, forcefully) => {
    const recipient  = name || this.defaultName;
    const str = `${greeting} ${recipient}`;
    return forcefully ? `${str.toUpperCase()}!` : str;
  };

  helloButtonClicked = () => {
    const greeting = this.formatGreeting("Hello",this.state.input.trim(),this.state.forcefully);
    this.setState({greeting});
  };

  goodbyeButtonClicked = () => {
    const greeting = this.formatGreeting("Goodbye",this.state.input.trim(),this.state.forcefully);
    this.setState({greeting});
  };

  inputChanged = e => {
    this.setState({input: e.target.value});
  };

  forcefullyChanged = e => {
    this.setState({forcefully: e.target.checked});
  };

  render(){ 
    return (
      <React.Fragment>
        <AppHeader title={this.props.title} subtitle={this.props.subtitle}/>
        <nav className="navbar">
          <div className="navbar-brand">
            <a className="navbar-item">
              <span className="icon">
                <i className="fas fa-handshake"></i>
              </span>
            </a>

            <a className="navbar-burger">
              <span></span>
              <span></span>
              <span></span>
            </a>
          </div>

          <div className="navbar-menu">
            <div className="navbar-start">
              <a className="navbar-item">
                Home
              </a>

              <a className="navbar-item has-text-weight-bold">
                App
              </a>
            </div>
          </div>
        </nav>

        <main>
          <div className="section has-background-light">	
            <div className="container mb-2">
              <button onClick={this.helloButtonClicked} id="btn-hello" className="button is-primary is-medium mr-1" title="Say hello">
                <span className="icon">
                  <i className="fas fa-handshake"></i>
                </span>
                <span>Hello</span>
              </button>
              <button onClick={this.goodbyeButtonClicked} id="btn-goodbye" className="button is-warning is-medium mr-1" title="Say goodbye">
                <span className="icon">
                  <i className="fas fa-sign-out-alt pr-3"></i>
                </span>
                <span>Goodbye</span>
              </button>
              <span className="field">
                <input checked = {this.state.input} onChange={this.inputChanged} id="input-firstname" className="input is-medium" style={{ width: '33%' }} type="text" placeholder="Type in your name" />
              </span>
            </div>
            <div className="container">
              <input value= {this.state.forcefully} onChange={this.forcefullyChanged} type="checkbox" id="cb-forcefully" className="checkbox" />
              <label htmlFor="cb-forcefully"> Forcefully</label>
            </div>
          </div>

          <div className="section has-background-light">
            <div id="output" className="container has-text-weight-bold pb-3">
              {this.state.greeting}
            </div>	
          </div>
        </main>
        <AppFooter text={this.props.author} />
      </React.Fragment>
    );
  }
};