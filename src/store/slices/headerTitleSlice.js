import { createSlice } from "@reduxjs/toolkit";

const headerTitleSlice = createSlice({
    name: "pageAddress",
    initialState: {
        title: "",
        subTitle: "",
        url: "",
        subUrl: "",
    },
    reducers: {
        removePageAddress(state) {
            state.pageAddress = "";
        },
        setPageAddress(state, action) {
            state.title = action.payload.title;
            state.url = action.payload.url;
            state.subTitle = action.payload.subTitle;
            state.subUrl = action.payload.subUrl;
        },
    },
});

export const { removePageAddress, setPageAddress } = headerTitleSlice.actions;

export default headerTitleSlice.reducer;
