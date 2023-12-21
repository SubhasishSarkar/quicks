import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
    },
    reducers: {
        logout(state) {
            localStorage.removeItem("quicks_token");
            state.user = null;
        },
        login(state, action) {
            // state e previous data and action e user data
            const user = action.payload;
            // console.log("user--slice",user)

            state.user = {
                id: user?.uid,
                email: user?.email,
                name: user?.name,
                role: user?.role,
                token: user?.token || localStorage.getItem("quicks_token"),
                status:user?.status,
                profile:user?.profile,
                approved:user?.approved,
                approveFirm:user?.approveFirm,
                profilePic:user?.imageUrl
            };
        },
        profile(state, action) {
            const user = action.payload;
            console.log("usss--",user)
            state.user = {
                id: user?.uid,
                email: user?.email,
                name: user?.name,
                role: user?.role,
                token: user?.token || localStorage.getItem("quicks_token"),
                status:user?.status,
                profile:user?.profile,
                approved:user?.approved,
                approveFirm:user?.approveFirm,
                profilePic:user?.imageUrl
            };
        },
        //handle multiple tab , user states
        refresh(state) {
            const token = localStorage.getItem("quicks_token");

            // token = null and user data is present : logged out from another tab
            //state.user.token != token from localStorage : logged out from different tab and then logged in, hence
            //  token mismatch between state and local
            if ((!token && state.user) || state.user?.token != token) {
                state.user = null;
            }
        },
    },
});

export const { logout, login, profile, refresh } = userSlice.actions;

export default userSlice.reducer;
