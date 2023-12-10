import styles from "./Modal.module.scss";
import ContentLoader from "react-content-loader";
import React from "react";
import {
  setImageUrl,
  setIsUpdate,
  setMessageValue,
  setReset,
} from "../../../../redux/slices/messagesSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store.ts";
import axios from "axios";
import InputFile from "../InputFile/InputFile.tsx";
import { MessageType } from "../../../../@types/messageType.ts";
import { choose } from "../../../../redux/slices/dialogSlice.ts";

export default function Modal({ inputRef }) {
  const messages = useSelector((state: RootState) => state.messages);
  const dialog = useSelector((state: RootState) => state.dialog);
  const user = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  async function sendMessageWithImage() {
    const inputValue = messages.messageValue;

    dispatch(setImageUrl(null));
    dispatch(setIsUpdate(false));
    dispatch(setMessageValue(null));
    dispatch(setReset(false));
    if (
      ((messages.imageUrl && !messages.isReset) ||
        inputValue.trim().length > 0) &&
      !messages.isUpdate
    ) {
      console.log(52);
      const newMessage: MessageType = {
        id: Math.random().toString(16).slice(2),
        sender_id: user.id,
        messageText: inputValue,
        imageUrl: messages.isReset ? null : messages.imageUrl,
        isLoading: true,
        created: Date.now(),
        updated: false,
        read: false,
      };

      dispatch(
        choose({ ...dialog, messages: [...dialog.messages, newMessage] }),
      );
      await axios.post("http://localhost:4444/api/messages", {
        newMessage,
        dialog_id: dialog.id,
      });
    } else if (
      ((messages.imageUrl && !messages.isReset) ||
        inputValue.trim().length > 0) &&
      messages.isUpdate
      // activeMessage.messageText !== inputValue.trim()
    ) {
      await axios.put("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        message_id: messages.activeMessage.id,
        messageText: inputValue,
        imageUrl: messages.isReset ? null : messages.imageUrl,
      });
    }
  }
  function resetImage() {
    dispatch(setReset(true));
  }

  function writeMessageWithImage(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      sendMessageWithImage();
    }
  }

  return (
    <div>
      {messages.isLoading ? (
        <div className={styles["dialog__input-modal"]}>
          <div className={styles["dialog__input-window"]}>
            <ContentLoader
              speed={2}
              width={400}
              height={400}
              viewBox="0 0 400 400"
              backgroundColor="#d9d9d9"
              foregroundColor="#ededed"
            >
              <rect x="0" y="0" rx="4" ry="4" width="400" height="200" />
              <rect x="0" y="360" rx="4" ry="4" width="400" height="40" />
            </ContentLoader>
          </div>
        </div>
      ) : (
        ""
      )}
      {messages.imageUrl ? (
        <div className={styles["dialog__input-modal"]}>
          <div className={styles["dialog__input-window"]}>
            <div className={styles["dialog__input-image"]}>
              {messages.isReset ? (
                <InputFile type={"upload"} inputRef={inputRef} />
              ) : (
                <img src={messages.imageUrl} alt="" />
              )}
              <div className={styles["dialog__input-buttons"]}>
                <div className={styles["dialog__input-editImage"]}>
                  <InputFile type={"refresh"} inputRef={inputRef} />
                </div>
                <div
                  className={styles["dialog__input-close"]}
                  onClick={() => resetImage()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    id="close"
                  >
                    <path d="M15.71,8.29a1,1,0,0,0-1.42,0L12,10.59,9.71,8.29A1,1,0,0,0,8.29,9.71L10.59,12l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L13.41,12l2.3-2.29A1,1,0,0,0,15.71,8.29Zm3.36-3.36A10,10,0,1,0,4.93,19.07,10,10,0,1,0,19.07,4.93ZM17.66,17.66A8,8,0,1,1,20,12,7.95,7.95,0,0,1,17.66,17.66Z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder={"Ваше сообщение"}
              value={messages.messageValue}
              onKeyDown={(event) => writeMessageWithImage(event)}
              onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setMessageValue(event.target.value))
              }
              className={styles["dialog__modal-input"]}
            />
            <div
              className={styles["dialog__modal-send"]}
              onClick={() => sendMessageWithImage()}
            >
              <img src="/img/message.svg" alt="" width={30} />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
