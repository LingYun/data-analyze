import React from "react";
import AppRouter from "./router.jsx";
import "antd/dist/antd.css";
import "./index.less";

class EntryApp extends React.PureComponent {
  render() {
    return <AppRouter />;
  }
}

export default EntryApp;
