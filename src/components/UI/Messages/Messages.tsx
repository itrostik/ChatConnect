import styles from "./Messages.module.scss";
import { getDate } from "../../../../utils/date.ts";
import { DialogType } from "../../../../@types/dialogType.ts";
import { UserType } from "../../../../@types/userType.ts";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageType } from "../../../../@types/messageType.ts";

export default function Messages({
  user,
  dialog,
}: {
  user: UserType;
  dialog: DialogType;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollChat = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeMessage, setActiveMessage] = useState<MessageType>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  async function sendMessage() {
    if (inputRef.current.value.trim().length > 0 && !isUpdate) {
      await axios.post("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        messageText: inputRef.current.value,
      });
      inputRef.current.value = "";
    } else if (
      inputRef.current.value.trim().length > 0 &&
      isUpdate &&
      activeMessage.messageText !== inputRef.current.value.trim()
    ) {
      console.log(activeMessage.messageText === inputRef.current.value.trim());
      await axios.put("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        message_id: activeMessage.id,
        messageText: inputRef.current.value,
      });
      inputRef.current.value = "";
    }
    inputRef.current.value = "";
    setIsUpdate(false);
  }

  useEffect(() => {
    document.addEventListener("click", () => {
      setOpenModal(false);
    });
    return () => {
      document.removeEventListener("click", () => {
        setOpenModal(false);
      });
    };
  }, []);

  useEffect(() => {
    if (scrollChat.current) {
      scrollChat.current.scrollTo({
        top: scrollChat?.current.scrollHeight,
      });
    }
  }, [scrollChat?.current?.scrollHeight]);

  function chooseMessage(
    event: React.MouseEvent<HTMLDivElement>,
    message: MessageType,
  ) {
    event.preventDefault();
    event.stopPropagation();
    if (activeMessage?.id === message.id) {
      setOpenModal(!openModal);
    } else {
      setOpenModal(true);
    }
    setActiveMessage(message);
  }

  function editMessage(message: MessageType) {
    inputRef.current.value = message.messageText;
    setIsUpdate(true);
  }

  async function deleteMessage(message_id: string) {
    await axios.delete("http://localhost:4444/api/messages", {
      data: { dialog_id: dialog.id, message_id },
    });
  }
  function writeMessage(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }
  return (
    <>
      <div className={styles["dialog__messages"]} ref={scrollChat}>
        {dialog.messages.map((message) => {
          if (message.sender_id === user.id) {
            return (
              <div
                key={message.id}
                className={styles["message-user"]}
                onContextMenu={(event) => chooseMessage(event, message)}
              >
                <div className={styles["message-user__text"]}>
                  {message.messageText}
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
                </div>
                {message.updated ? (
                  <div className={styles["message-user__edited"]}>
                    (изменено)
                  </div>
                ) : (
                  ""
                )}
                {activeMessage?.id === message.id && openModal ? (
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
          } else {
            return (
              <div key={message.id} className={styles["message-mate"]}>
                <div className={styles["message-mate__text"]}>
                  {message.messageText}
                </div>
                <svg
                  width="11"
                  height="8"
                  viewBox="0 0 11 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles["svg-triangle"]}
                >
                  <path d="M7 0L11 4.5L0 7.5L7 0Z" fill="#7C00A9" />
                </svg>
                {message.updated ? (
                  <div className={styles["message-mate__edited"]}>
                    (изменено)
                  </div>
                ) : (
                  ""
                )}
                <div className={styles["message-user__time"]}>
                  {getDate(message.created)}
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className={styles["dialog__input-message"]}>
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
      </div>
    </>
  );
}
