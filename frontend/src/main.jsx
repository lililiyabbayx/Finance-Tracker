import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { kpiApi } from "@/states/kpiApi";
import { transactionApi } from "@/states/transactionApi"; 
import { analyticsApi } from "@/states/analyticsApi";
import { financialWidgetsApi } from "@/states/financialWidgetsApi";
import { recurrentEntriesApi } from "@/states/recurrentEntriesApi";
import { financialInsightsApi } from "@/states/financialInsightsApi";
import { travelExpensesApi } from "@/states/travelExpensesApi";

// Configure the store
export const store = configureStore({
  reducer: {
    [kpiApi.reducerPath]: kpiApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer, 
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [financialWidgetsApi.reducerPath]: financialWidgetsApi.reducer,
    [recurrentEntriesApi.reducerPath]: recurrentEntriesApi.reducer,
    [financialInsightsApi.reducerPath]: financialInsightsApi.reducer,
    [travelExpensesApi.reducerPath]: travelExpensesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      kpiApi.middleware,
      transactionApi.middleware, 
      analyticsApi.middleware,
      financialWidgetsApi.middleware,
      recurrentEntriesApi.middleware,
      financialInsightsApi.middleware,
      travelExpensesApi.middleware
    ),
});

setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
