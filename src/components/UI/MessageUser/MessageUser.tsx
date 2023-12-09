import styles from "./MessageUser.module.scss";
import { getDate } from "../../../../utils/date.ts";
import React from "react";
import { MessageType } from "../../../../@types/messageType.ts";
import {
  setActiveMessage,
  setImageUrl,
  setIsOpenModal,
  setIsScrolling,
  setIsUpdate,
  setMessageValue,
} from "../../../../redux/slices/messagesSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store.ts";
import axios from "axios";

export default function MessageUser({ message, inputRef }) {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.messages);
  const dialog = useSelector((state: RootState) => state.dialog);
  function chooseMessage(
    event: React.MouseEvent<HTMLDivElement>,
    message: MessageType,
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (messages.activeMessage?.id === message.id) {
      dispatch(setIsOpenModal(!messages.isOpenModal));
    } else {
      dispatch(setIsOpenModal(true));
    }
    dispatch(setActiveMessage(message));
  }

  function editMessage(message: MessageType) {
    if (message.imageUrl) {
      dispatch(setImageUrl(message.imageUrl));
      dispatch(setMessageValue(message.messageText));
    } else {
      inputRef.current.value = message.messageText;
    }
    dispatch(setIsUpdate(true));
  }

  async function deleteMessage(message_id: string) {
    await axios.delete("http://localhost:4444/api/messages", {
      data: { dialog_id: dialog.id, message_id },
    });
    dispatch(setIsScrolling(false));
  }

  return (
    <div
      id={message.id}
      className={styles["message-user"]}
      onContextMenu={(event) => chooseMessage(event, message)}
    >
      <div className={styles["message-user__text"]}>
        {message.imageUrl ? (
          <div className={styles["message-user-image"]}>
            <img src={message.imageUrl} alt="" />
          </div>
        ) : (
          ""
        )}
        <div className={styles["message-user__textMessage"]}>
          {message.messageText}
        </div>
      </div>
      <svg
        width="11"
        height="8"
        viewBox="0 0 11 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles["svg-triangle"]}
      >
        <path d="M4 0L0 4.8L11 8L4 0Z" fill="#00d3ff" />
      </svg>
      <div className={styles["message-user__time"]}>
        {getDate(message.created)}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          id="check-read"
          className={styles["message-user__read"]}
        >
          <path
            fill="#ffffff"
            fillRule="evenodd"
            d="M15.4933 6.93502C15.8053 7.20743 15.8374 7.68122 15.565 7.99325L7.70786 16.9933C7.56543 17.1564 7.35943 17.25 7.14287 17.25C6.9263 17.25 6.72031 17.1564 6.57788 16.9933L3.43502 13.3933C3.16261 13.0812 3.19473 12.6074 3.50677 12.335C3.8188 12.0626 4.29259 12.0947 4.565 12.4068L7.14287 15.3596L14.435 7.00677C14.7074 6.69473 15.1812 6.66261 15.4933 6.93502Z"
            clipRule="evenodd"
            className={
              message.read ? styles["path-read"] : styles["path-noRead"]
            }
          ></path>
          <path
            fill="#ffffff"
            fillRule="evenodd"
            d="M20.5173 7.01941C20.8172 7.30507 20.8288 7.77981 20.5431 8.07975L11.9715 17.0798C11.82 17.2388 11.6064 17.3235 11.387 17.3114C11.1677 17.2993 10.9647 17.1916 10.8317 17.0169L10.4033 16.4544C10.1524 16.1248 10.2161 15.6542 10.5457 15.4033C10.8288 15.1877 11.216 15.2044 11.4786 15.4223L19.4569 7.04525C19.7426 6.74531 20.2173 6.73374 20.5173 7.01941Z"
            clipRule="evenodd"
            className={
              message.read ? styles["path-read"] : styles["path-noRead"]
            }
          ></path>
        </svg>
      </div>
      {message.updated ? (
        <div className={styles["message-user__edited"]}>(изменено)</div>
      ) : (
        ""
      )}
      {messages.activeMessage?.id === message.id && messages.isOpenModal ? (
        <div className={styles["message-user__modal"]}>
          <div
            className={styles["message-user__edit"]}
            onClick={() => editMessage(message)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              id="edit"
            >
              <path d="M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
            <span>Редактировать</span>
          </div>
          <div
            className={styles["message-user__delete"]}
            onClick={() => deleteMessage(message.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              id="delete"
            >
              <path d="M24.2,12.193,23.8,24.3a3.988,3.988,0,0,1-4,3.857H12.2a3.988,3.988,0,0,1-4-3.853L7.8,12.193a1,1,0,0,1,2-.066l.4,12.11a2,2,0,0,0,2,1.923h7.6a2,2,0,0,0,2-1.927l.4-12.106a1,1,0,0,1,2,.066Zm1.323-4.029a1,1,0,0,1-1,1H7.478a1,1,0,0,1,0-2h3.1a1.276,1.276,0,0,0,1.273-1.148,2.991,2.991,0,0,1,2.984-2.694h2.33a2.991,2.991,0,0,1,2.984,2.694,1.276,1.276,0,0,0,1.273,1.148h3.1A1,1,0,0,1,25.522,8.164Zm-11.936-1h4.828a3.3,3.3,0,0,1-.255-.944,1,1,0,0,0-.994-.9h-2.33a1,1,0,0,0-.994.9A3.3,3.3,0,0,1,13.586,7.164Zm1.007,15.151V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Zm4.814,0V13.8a1,1,0,0,0-2,0v8.519a1,1,0,0,0,2,0Z"></path>
            </svg>
            <span>Удалить</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
