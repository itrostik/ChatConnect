import styles from "./Messages.module.scss";
import { getDate } from "../../../../utils/date.ts";
import { DialogType } from "../../../../@types/dialogType.ts";
import { UserType } from "../../../../@types/userType.ts";
import React, { useEffect, useRef } from "react";
import axios from "axios";

export default function Messages({
  user,
  dialog,
}: {
  user: UserType;
  dialog: DialogType;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollChat = useRef<HTMLDivElement>(null);

  async function sendMessage() {
    if (inputRef.current.value.trim().length > 0) {
      await axios.post("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        messageText: inputRef.current.value,
      });
      inputRef.current.value = "";
    }
  }

  useEffect(() => {
    if (scrollChat.current) {
      scrollChat.current.scrollTo({
        top: scrollChat?.current.scrollHeight,
      });
    }
  }, [scrollChat?.current?.scrollHeight]);

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
              <div key={message.id} className={styles["message-user"]}>
                <div className={styles["message-user__text"]}>
                  {message.messageText}
                </div>
                <div className={styles["message-user__time"]}>
                  {getDate(message.created)}
                </div>
              </div>
            );
          } else {
            return (
              <div key={message.id} className={styles["message-mate"]}>
                <div className={styles["message-mate__text"]}>
                  {message.messageText}
                </div>
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
