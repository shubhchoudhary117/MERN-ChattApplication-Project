import { configureStore } from '@reduxjs/toolkit'
import userContext from "./features/getUser.js"
export default configureStore({
  reducer: {
    userDetails:userContext
  },
}) 