import { createSlice } from "@reduxjs/toolkit";

const subjectsSlice = createSlice({
  name: "subjects",
  initialState: {
    items: []
  },
  reducers: {}
});

export default subjectsSlice.reducer;