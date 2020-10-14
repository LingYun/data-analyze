import React from "react";
import { Route, BrowserRouter, Link, Switch } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar/index.jsx";
import SliderMenu from "@/components/Sidebar/index.jsx";
import HomePage from "./pages/home/index.jsx";

class AppRouter extends React.PureComponent {
  render() {
    return (
      <BrowserRouter>
        <div className="root-container">
          <div className="slider-container">
            <SliderMenu />
          </div>
          <div className="page-container">
            <NavigationBar />
            <div className="page-index">
              {/* Switch只显示一个组件。加exact表示精确匹配/。如果不加exact，/xxx也会匹配/。  */}
              <Switch>
                {/* exact */}
                <Route exact path="/home" component={HomePage} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default AppRouter;
