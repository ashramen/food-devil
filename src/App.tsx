import { BrowserRouter, Switch, Route } from 'react-router-dom';

import RecordMeal from "./components/recordMeal/recordMeal";
import NutritionReport from "./components/nutritionReport/nutritionReport";
import Login from "./components/login/login";
import Restaurants from "./components/restaurants/restuarants";

import './App.css';

function App() {
  return (
    <div className="App">
      <div className="content">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <NutritionReport />
          </Route>
          <Route exact path="/recordmeal">
            <RecordMeal />
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
