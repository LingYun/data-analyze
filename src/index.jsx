import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import EntryApp from "./entryApp.jsx";
import rootReducer from "./redux/reducers";
const store = createStore(rootReducer);

const appRoot = document.getElementById("app");

// render(
//   <Provider store={store}>
//     <EntryApp />
//   </Provider>,
//   appRoot
// );

render(<EntryApp />, appRoot);
