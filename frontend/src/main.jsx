import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { kpiApi } from "@/states/kpiApi";
import { transactionApi } from "@/states/transactionApi"; // Correct import for transactionApi

// Configure the store
export const store = configureStore({
  reducer: {
    [kpiApi.reducerPath]: kpiApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer, // Add the transactionApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      kpiApi.middleware,
      transactionApi.middleware // Add the transactionApi middleware
    ),
});

setupListeners(store.dispatch);

// Render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
