import { createSlice } from '@reduxjs/toolkit'

export const userContext = createSlice({
  name: 'getuser',
  initialState: {
   user:{},
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = userContext.actions;

export default userContext.reducer