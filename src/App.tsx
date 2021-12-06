import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HomePage from "./components/homePage/HomePage";
import RecordMeal from "./components/recordMeal/recordMeal";
import NutritionReport from "./components/nutritionReport/nutritionReport";
import Login from "./components/login/login";
import ProfilePage from "./components/profile/profile"
import Restaurants from "./components/restaurants/restaurants";
import RestaurantInfo from "./components/restaurants/restaurantInfo";

import './App.css';

function App() {
  return (
    <div className="App">
      <div className="content">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route exact path="/nutritionreport">
              <NutritionReport />
            </Route>
            <Route exact path="/profile">
              <ProfilePage />
            </Route>
            <Route exact path="/recordmeal">
              <RecordMeal />
            </Route>
            <Route exact path="/restaurants">
              <Restaurants />
            </Route>
            <Route exact path="/restaurants/:name/:id" component={RestaurantInfo} />
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
