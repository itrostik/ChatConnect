import styles from "./Sidebar.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { DialogType } from "../../../@types/dialogType.ts";
import { MateType } from "../../../@types/mateType.ts";
import { collection, onSnapshot, or, where, query } from "firebase/firestore";
import db from "../../../utils/database.ts";
import { choose } from "../../../redux/slices/dialogSlice.ts";
import { useDispatch } from "react-redux";
import { UserType } from "../../../@types/userType.ts";
import axios from "axios";
import ContentLoader from "react-content-loader";
import { MessageType } from "../../../@types/messageType.ts";
import { getDate } from "../../../utils/date.ts";

export default function Sidebar({
  user,
  isLoading,
  setIsLoading,
}: {
  user: UserType;
  isLoading: boolean;
  setIsLoading: React.Dispatch<boolean>;
}) {
  const [dialogs, setDialogs] = useState<(DialogType & MateType)[] | null>(
    JSON.parse(localStorage.getItem("dialogs")),
  );
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, "dialogs"),
      or(where("user_id", "==", user.id), where("user2_id", "==", user.id)),
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      let dialogs = [];
      const dialogSize = querySnapshot.docs.length;
      if (dialogSize > 0) {
        querySnapshot.docs.map(async (doc, index) => {
          const dialog = doc.data();
          const mateId =
            dialog.user_id === user.id ? dialog.user2_id : dialog.user_id;
          const mate = await axios.get<UserType>(
            `https://chatconnectapp.netlify.app/api/users/${mateId}`,
          );
          const countNotRead = dialog.messages.reduce((accum, message) => {
            if (message.sender_id === mateId && !message.read) {
              accum++;
            }
            return accum;
          }, 0);
          if (mate.data)
            dialogs.push({
              ...dialog,
              id: doc.id,
              mate: { ...mate.data, id: mateId },
              countNotRead,
            });
          else dialogs.push({ ...dialog, id: doc.id });
          if (index + 1 === dialogSize) {
            dialogs = dialogs.sort((a, b) => {
              if (a.messages.length > 0 && b.messages.length > 0) {
                return (
                  b.messages[b.messages.length - 1].created -
                  a.messages[a.messages.length - 1].created
                );
              }
            });
            setDialogs(dialogs);
            localStorage.setItem("dialogs", JSON.stringify(dialogs));
          }
        });
      } else {
        setDialogs(dialogs);
        localStorage.setItem("dialogs", JSON.stringify(dialogs));
      }
      setIsLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);
  function getLastMessage(messages: MessageType[]): MessageType {
    return messages[messages.length - 1];
  }
  function chooseDialog(dialog: DialogType & MateType) {
    // const { mate, ...dialogItem } = dialog;
    dispatch(choose(dialog));
  }

  function search() {
    if (inputRef.current.value.trim().length > 0) {
      setDialogs(
        dialogs.filter((dialog) => {
          return dialog.mate.username.includes(inputRef.current.value);
        }),
      );
    } else {
      setDialogs(JSON.parse(localStorage.getItem("dialogs")));
    }
  }

  function reset() {
    inputRef.current.value = "";
    setDialogs(JSON.parse(localStorage.getItem("dialogs")));
  }

  function setLastMessageInSidebar(messageText: string) {
    return messageText.length < 50
      ? messageText
      : messageText.slice(0, 49).trim() + "...";
  }

  return (
    <>
      {!isLoading ? (
        <div className={styles["sidebar"]}>
          <div className={styles["sidebar__search"]}>
            <label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                id="search"
              >
                <path
                  fill="#000000"
                  d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"
                ></path>
              </svg>

              <input
                type="text"
                placeholder={"Поиск"}
                ref={inputRef}
                onInput={() => search()}
              />
              <div onClick={() => reset()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="close"
                >
                  <path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                </svg>
              </div>
            </label>
          </div>
          {dialogs &&
            dialogs.map((dialog) => (
              <div
                key={dialog.id}
                className={styles["dialog"]}
                onClick={() => chooseDialog(dialog)}
              >
                <div className={styles["dialog__image"]}>
                  <img src={dialog.mate.avatarUrl} alt="" />
                </div>
                <div className={styles["dialog__info"]}>
                  <div className={styles["dialog__username"]}>
                    {dialog.mate.username}
                  </div>
                  <div className={styles["dialog__lastmessage"]}>
                    <div className={styles["dialog__lastmessage-text"]}>
                      {dialog.messages.length > 0
                        ? getLastMessage(dialog.messages).sender_id === user.id
                          ? "Вы: " +
                            setLastMessageInSidebar(
                              getLastMessage(dialog.messages).messageText,
                            )
                          : setLastMessageInSidebar(
                              getLastMessage(dialog.messages).messageText,
                            )
                        : ""}
                    </div>
                    {dialog.countNotRead > 0 ? (
                      <div className={styles["dialog__notRead"]}>
                        {dialog.countNotRead}
                      </div>
                    ) : (
                      <div className={styles["dialog__lastmessage-time"]}>
                        {dialog.messages.length > 0
                          ? getDate(getLastMessage(dialog.messages).created)
                          : ""}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <ContentLoader
          speed={2}
          width={550}
          height={280}
          viewBox="0 0 550 280"
          backgroundColor="#d9d9d9"
          foregroundColor="#ededed"
        >
          <circle cx="20" cy="20" r="20" />
          <rect x="50" y="0" rx="4" ry="4" width="500" height="40" />
          <circle cx="20" cy="65" r="20" />
          <rect x="50" y="45" rx="4" ry="4" width="500" height="40" />
          <circle cx="20" cy="110" r="20" />
          <rect x="50" y="90" rx="4" ry="4" width="500" height="40" />
          <circle cx="20" cy="155" r="20" />
          <rect x="50" y="135" rx="4" ry="4" width="500" height="40" />
          <circle cx="20" cy="200" r="20" />
          <rect x="50" y="180" rx="4" ry="4" width="500" height="40" />
        </ContentLoader>
      )}
    </>
  );
}
