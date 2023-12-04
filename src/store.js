import { combineReducers, configureStore } from "@reduxjs/toolkit";
import api from "./api/apiSlice";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  //   devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
