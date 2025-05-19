import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "../Home";
import Mision from "../Mision";
import Register from "../Register";
import Quienessomos from "../Quienessomos";
import Recomendaciones from "../Recomendaciones";
import Catalogo from "../Catalogo";
import Barberos from "../Barberos";
import Horarios from "../Horarios";
import Admin from "../Admin";
import Login from "../pages/Login";
import Term_Y_Cond from "../pages/Term_Y_Cond";
import AdminPanel from "../AdminPanel";
import TableView from "../components/TableView";
import AccountStatus from "../components/AccountStatus";
/*import dataPricing from "../dataPricing";*/

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/Catalogo" component={Catalogo} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/Register" component={Register} />
          <Route exact path="/Recomendaciones" component={Recomendaciones} />
          <Route exact path="/Mision" component={Mision} />
          <Route exact path="/Quienessomos" component={Quienessomos} />
          <Route exact path="/Barberos" component={Barberos} />
          <Route exact path="/Horarios" component={Horarios} />
          <Route exact path="/Admin" component={Admin} />
          <Route exact path="/Term_Y_Cond" component={Term_Y_Cond} />
          <Route exact path="/AdminPanel" component={AdminPanel} />
          <Route exact path="/TableView" component={TableView} />
          <Route exact path="/AccountStatus" component={AccountStatus} />
          
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;