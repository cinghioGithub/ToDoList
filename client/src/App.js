import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import { Header, Main, InitialSpinner } from "./Components";
import { useState, React, useEffect } from "react";
import { menuFilters } from "./DataBase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./Components/Login";
import API from "./API";

function App() {
  const [toggle, setToggle] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState();
  const [sessionCheck, setSessionCheck] = useState(true);

  const login = async (user) => {
    setUser(user);
    setIsLogged(true);
  };

  const logout = async () => {
    await API.logOut();
    setIsLogged(false);
    // clean up everything
  };

  const hideShow = () => {
    setToggle((toggle) => !toggle);
  };

  /* check oonly the first time, if the session is already authenticated */
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("GET SESSION CURRENT useEffect [TRY]");
        const user = await API.checkSession();
        //if (user.name){
          setUser(user);
          setIsLogged(true);
        //}
        setInterval(() => {
          // usefull to wait the useEffect before rendering. without this, when there is already an active cookie session, temporarely render glitch happens.
          // In fact, for an instant, it will be wrongly rendered the login page
          setSessionCheck(false);
        }, 2000);
      } catch (err) {
        console.log("GET SESSION CURRENT useEffect [CATCH]", err);
        setInterval(() => {
          // usefull to wait the useEffect before rendering. without this, when there is already an active cookie session, temporarely render glitch happens.
          // In fact, for an instant, it will be wrongly rendered the login page
          setSessionCheck(false);
        }, 2000);
      }
    };
    if (sessionCheck) {
      checkSession();
    }
    console.log("GET SESSION CURRENT useEffect [END]");
  }, [sessionCheck]);

  return (
    <>
      {sessionCheck ? (
        <InitialSpinner />
      ) : (
        <Router>
          <Switch>
            <Route path="/filter/:filter">
              {isLogged ? (
                <>
                  <Header
                    toggleFunc={hideShow}
                    title="Todo List"
                    username={user.name}
                    logout={logout}
                  />
                  <Main toggle={toggle} menuFilters={menuFilters} user={user} />
                </>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
            <Route path="/login">
              {isLogged ? <Redirect to="/" /> : <Login login={login} />}
            </Route>
            <Route path="/">
              {isLogged ? (
                <>
                  <Header
                    toggleFunc={hideShow}
                    title="Todo List"
                    username={user.name}
                    logout={logout}
                  />
                  <Main toggle={toggle} menuFilters={menuFilters} user={user} />
                </>
              ) : (
                <Redirect to="/login" />
              )}
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
