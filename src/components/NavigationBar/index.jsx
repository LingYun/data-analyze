import React, { Component } from "react";
import "./index.less";

class NavigationBar extends Component {
  render() {
    return (
      <div className="navigation-bar">
        <div className="navigation-logo">
          <img
            className="icon-img"
            src="http://upload.jianshu.io/users/upload_avatars/2152694/e1c9a0f8-fd43-4c51-a432-270b04da7e48.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240"
          ></img>
          <div className="icon-title">白衣沽酒</div>
        </div>
      </div>
    );
  }
}

export default NavigationBar;
