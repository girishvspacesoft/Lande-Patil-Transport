import { createSlice } from '@reduxjs/toolkit';


const localUser = JSON.parse(localStorage.getItem('userData'));

const emptyState = {
  branch: '',
  employee: {},
  permissions: {},
  type: '',
  username: ''
};

const initialState = localUser && localUser.username ? localUser : emptyState;

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    update: (state, action) => {
      return {
        ...action.payload
      }
    },
    remove: (state) => {
      return {
        ...emptyState
      }
    }
  }
});

export const { update, remove } = userSlice.actions;
export default userSlice.reducer;