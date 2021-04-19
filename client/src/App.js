
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {NavBar} from './components/navBar/NavBar';
import {HomePage} from './containers/HomePage';
import {ShopPage} from './containers/ShopPage';
import {LoginPage} from './containers/LoginPage/LoginPage';
import {RegisterPage} from './containers/RegisterPage/RegisterPage';
import {UserPage} from './containers/UserPage/UserPage';
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
            <Route path= "/login" exact component={LoginPage}/>
            <Route path='/register' exact component={RegisterPage}/>
            <Route path='/user' exact component={UserPage}/>
          </Switch>
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
