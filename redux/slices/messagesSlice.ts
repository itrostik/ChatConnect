import { MessageType } from "../../@types/messageType";
import { createSlice } from "@reduxjs/toolkit";

type Messages = {
  activeMessage: MessageType;
  imageUrl: string | null;
  isUpdate: boolean;
  isReset: boolean;
  isOpenModal: boolean;
  isLoading: boolean;
  isScrolling: boolean;
  messageValue: string | null;
};

const initialState: Messages = {
  activeMessage: null,
  imageUrl: null,
  isUpdate: false,
  isReset: false,
  isOpenModal: false,
  isLoading: false,
  isScrolling: true,
  messageValue: null,
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setActiveMessage(state, action) {
      state.activeMessage = action.payload;
    },
    setReset(state, action) {
      state.isReset = action.payload;
    },
    setImageUrl(state, action) {
      state.imageUrl = action.payload;
    },
    setIsUpdate(state, action) {
      state.isUpdate = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setIsOpenModal(state, action) {
      state.isOpenModal = action.payload;
    },
    setIsScrolling(state, action) {
      state.isScrolling = action.payload;
    },
    setMessageValue(state, action) {
      state.messageValue = action.payload;
    },
  },
});

export const {
  setActiveMessage,
  setReset,
  setImageUrl,
  setIsUpdate,
  setIsLoading,
  setIsOpenModal,
  setMessageValue,
  setIsScrolling,
} = messagesSlice.actions;

export default messagesSlice.reducer;
