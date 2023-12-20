import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
    },
    reducers: {
        logout(state) {
            localStorage.removeItem("bmssy_token");
            state.user = null;
        },
        login(state, action) {
            // state e previous data and action e user data
            const user = action.payload;

            state.user = {
                id: user.uid,
                email: user.email,
                name: user.name,
                role: user.role_name,
                district: Number(user.district_code),
                subDivision: Number(user.sub_div_code),
                blockCode: Number(user.block_code),
                rid: Number(user.rid),
                profilePic: user?.profile_pic,
                postingType: Number(user.posting_type),
                rloCode: Number(user.rlo_code),
                lwfcCode: user.lwfc_code,
                updatePassword: user.update_password,
                token: user.token,
            };
        },
        profile(state, action) {
            const user = action.payload;
            state.user = {
                id: user.uid,
                email: user.email,
                name: user.name,
                role: user.role_name,
                district: Number(user.district_code),
                subDivision: Number(user.sub_div_code),
                blockCode: Number(user.block_code),
                rid: Number(user.rid),
                profilePic: user?.profile_pic,
                postingType: Number(user.posting_type),
                updatePassword: user.update_password,
                token: user.token || localStorage.getItem("bmssy_token"),
            };
        },
        //handle multiple tab , user states
        refresh(state) {
            const token = localStorage.getItem("bmssy_token");

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
