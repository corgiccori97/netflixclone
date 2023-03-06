import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tvshows';
import Header from './Components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
