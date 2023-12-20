import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import headerTitleSlice from "./slices/headerTitleSlice";

const store = configureStore({ reducer: { user: userSlice, pageAddress: headerTitleSlice } });

export default store;
