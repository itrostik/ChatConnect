import styles from "./Input.module.scss";
import React from "react";
import {
  setImageUrl,
  setIsUpdate,
  setMessageValue,
} from "../../../../redux/slices/messagesSlice.ts";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store.ts";
import InputFile from "../../Messages/InputFile/InputFile.tsx";
import { choose } from "../../../../redux/slices/dialogSlice.ts";
import { MessageType } from "../../../../@types/messageType.ts";

export default function Input({ inputRef }) {
  const dispatch = useDispatch();

  const messages = useSelector((state: RootState) => state.messages);
  const dialog = useSelector((state: RootState) => state.dialog);
  const user = useSelector((state: RootState) => state.user);
  async function sendMessage() {
    const inputValue = inputRef.current.value;

    inputRef.current.value = "";
    if (inputValue.trim().length > 0 && !messages.isUpdate) {
      const newMessage: MessageType = {
        id: Math.random().toString(16).slice(2),
        sender_id: user.id,
        messageText: inputValue,
        imageUrl: null,
        isLoading: true,
        created: Date.now(),
        updated: false,
        read: false,
      };
      dispatch(
        choose({ ...dialog, messages: [...dialog.messages, newMessage] }),
      );
      console.log("что происходит?");
      const response = await axios.post(
        "https://chatconnectapp.netlify.app/api/messages",
        {
          newMessage,
          dialog_id: dialog.id,
        },
      );
      console.log(response.data);
    } else if (
      inputValue.trim().length > 0 &&
      messages.isUpdate &&
      messages.activeMessage.messageText !== inputValue.trim()
    ) {
      await axios.put("https://chatconnectapp.netlify.app/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        message_id: messages.activeMessage.id,
        messageText: inputValue,
        imageUrl: null,
      });
    }
    dispatch(setImageUrl(null));
    dispatch(setIsUpdate(false));
    dispatch(setMessageValue(null));
  }

  function writeMessage(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <>
      <InputFile type={"add"} inputRef={inputRef} />
      <input
        type="text"
        placeholder={"Введите сообщение"}
        ref={inputRef}
        onKeyDown={(event) => writeMessage(event)}
      />
      <div
        className={styles["dialog__input-send"]}
        onClick={() => sendMessage()}
      >
        <img src="/img/message.svg" alt="" width={30} />
      </div>
    </>
  );
}
