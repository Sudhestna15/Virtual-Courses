import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage if exists
const storedUser = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: storedUser, 
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            if (action.payload) {
                localStorage.setItem("userData", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("userData");
            }
        },
    },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
