import { createSlice } from "@reduxjs/toolkit";

const studentsSlice = createSlice({
  name: "students",
  initialState: {
    items: []
  },
  reducers: {}
});

export default studentsSlice.reducer;