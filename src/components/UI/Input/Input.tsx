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

export default function Input({ inputRef }) {
  const dispatch = useDispatch();

  const messages = useSelector((state: RootState) => state.messages);
  const dialog = useSelector((state: RootState) => state.dialog);
  const user = useSelector((state: RootState) => state.user);
  async function sendMessage() {
    if (inputRef.current.value.trim().length > 0 && !messages.isUpdate) {
      await axios.post("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        messageText: inputRef.current.value,
        imageUrl: null,
      });
    } else if (
      inputRef.current.value.trim().length > 0 &&
      messages.isUpdate &&
      messages.activeMessage.messageText !== inputRef.current.value.trim()
    ) {
      await axios.put("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        message_id: messages.activeMessage.id,
        messageText: inputRef.current.value,
        imageUrl: null,
      });
    }
    inputRef.current.value = "";
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
