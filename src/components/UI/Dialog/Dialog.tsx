import styles from "./Dialog.module.scss";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserType } from "../../../../@types/userType.ts";
import { DialogType } from "../../../../@types/dialogType.ts";
import db from "../../../../utils/database.ts";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { choose } from "../../../../redux/slices/dialogSlice.ts";
import ContentLoader from "react-content-loader";
import { getDate } from "../../../../utils/date.ts";
export default function Dialog({
  dialog,
  user,
}: {
  dialog: DialogType;
  user: UserType;
}) {
  const [mate, setMate] = useState<UserType>(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    const getMate = async () => {
      const mateId =
        dialog.user2_id !== user.id ? dialog.user2_id : dialog.user_id;
      const mate = await axios.get<UserType>(
        `http://localhost:4444/api/users/${mateId}`,
      );
      setMate(mate.data);
      setIsLoading(false);
    };
    getMate();
  }, [dialog]);
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
  function writeMessage(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "dialogs", dialog.id), (doc) => {
      dispatch(choose({ ...doc.data(), id: doc.id }));
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className={styles["dialog"]}>
      {!isLoading && mate ? (
        <>
          <div className={styles["dialog__header"]}>
            <div className={styles["dialog__header-image"]}>
              <img src={mate.avatarUrl} alt="avatar" />
            </div>
            <div className={styles["dialog__header-info"]}>
              <div className={styles["dialog__header-name"]}>
                {mate.username}
              </div>
              <div className={styles["dialog__header-time"]}>
                был в сети 5 минут назад
              </div>
            </div>
          </div>
          <div className={styles["dialog__messages"]}>
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
      ) : (
        <ContentLoader
          speed={2}
          max-width={1200}
          height={55}
          viewBox="0 0 1200 55"
          backgroundColor="#5e5e5e"
          foregroundColor="#5e5e5e"
        >
          <rect x="0" y="0" rx="4" ry="4" width="100%" height="55" />
        </ContentLoader>
      )}
    </div>
  );
}
