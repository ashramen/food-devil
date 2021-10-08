import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AddMeal from "./components/addmeal/addMeal";
import Home from "./components/home/home";
import Restaurants from "./components/restaurants/restuarants";
import Login from "./components/login/login";

function App() {
  return (
    <div className="App">
      <div className="content">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/addmeal">
            <AddMeal />
          </Route>
          <Route exact path="/restaurants">
            <Restaurants />
          </Route>
          <Route exact path="/login">
          <div className='login'>
            <div className='loginPage'>
              <Login />
            </div>
          </div>
          </Route>
        </Switch>
      </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
