
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {NavBar} from './components/navBar/NavBar';
import {HomePage} from './containers/HomePage';
import {ShopPage} from './containers/ShopPage';
import {Footer} from './components/footer/Footer';

function App() {
  return (
    <div>
      <NavBar />
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" exact component={HomePage}/>
            <Route path="/shop" exact component={ShopPage}/>
          </Switch>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
