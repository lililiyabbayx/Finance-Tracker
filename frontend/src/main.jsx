import ReactDOM from "react-dom/client";
import App from "@/App"
import "@/index.css"
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "@/states/api";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(api.middleware),
});
setupListeners(store.dispatch)

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <App />
    </LocalizationProvider>
  </Provider>
)