import { createSlice } from "@reduxjs/toolkit";
import { Resource } from "../types/entities";
import { MultipleItemsResponseType } from "../types/success-response-types";

export type ResourceInitialStateType = {
  resources: MultipleItemsResponseType<Resource> | null;
  loadingResources: boolean;
};

const initialState: ResourceInitialStateType = {
  resources: null,
  loadingResources: false,
};

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setResources(
      state,
      action: { payload: MultipleItemsResponseType<Resource> | null }
    ) {
      state.resources = action.payload;
    },
    setLoadingResources(state, action: { payload: boolean }) {
      state.loadingResources = action.payload;
    },
    addItem(state, action: { payload: Resource }) {
      if (state.resources) {
        state.resources.data = [action.payload, ...state.resources.data];

        if (state.resources.data.length === 0) {
          state.resources.totalPages = 1;
        }
      }
    },
    removeItem(state, action: { payload: string }) {
      if (state.resources) {
        state.resources.data = state.resources.data.filter(
          (item) => item.resource.id !== action.payload
        );
      }
    },
  },
});

export const { setLoadingResources, setResources, addItem, removeItem } =
  resourceSlice.actions;

export default resourceSlice.reducer;
