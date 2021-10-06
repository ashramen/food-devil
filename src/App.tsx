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
            <Login />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
