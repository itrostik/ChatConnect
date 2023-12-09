import styles from "./Messages.module.scss";

import { useEffect, useRef } from "react";

import { UserType } from "../../../@types/userType.ts";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import {
  setIsOpenModal,
  setIsScrolling,
} from "../../../redux/slices/messagesSlice.ts";

import Input from "../UI/Input/Input.tsx";
import MessageMate from "../UI/MessageMate/MessageMate.tsx";
import MessageUser from "../UI/MessageUser/MessageUser.tsx";
import Modal from "./Modal/Modal.tsx";
import axios from "axios";
import _ from "lodash";
export default function Messages({ user }: { user: UserType }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollChat = useRef<HTMLDivElement>(null);

  const dialog = useSelector((state: RootState) => state.dialog);
  const messages = useSelector((state: RootState) => state.messages);
  const dispatch = useDispatch();

  const handleDebounce = _.debounce(handleScroll, 100);

  useEffect(() => {
    document.addEventListener("click", () => {
      dispatch(setIsOpenModal(false));
    });
    return () => {
      document.removeEventListener("click", () => {
        dispatch(setIsOpenModal(false));
      });
      dispatch(setIsScrolling(true));
    };
  }, []);

  useEffect(() => {
    if (
      (scrollChat.current &&
        dialog.messages.length > 0 &&
        (dialog.messages[dialog.messages.length - 1].sender_id === user.id ||
          scrollChat.current.scrollTop + scrollChat.current.clientHeight >=
            scrollChat.current.scrollHeight - 100) &&
        JSON.parse(localStorage.getItem("messages")).length <
          dialog.messages.length) ||
      messages.isScrolling
    ) {
      dispatch(setIsScrolling(false));
      scrollChat.current.scrollTo({
        top: scrollChat?.current.scrollHeight,
      });
    }
    localStorage.setItem("messages", JSON.stringify(dialog.messages));
  }, [dialog.messages.length]);

  async function handleScroll() {
    if (scrollChat.current) {
      const chatRect = scrollChat.current.getBoundingClientRect();
      const visibleMessages = [];
      dialog.messages.forEach((message) => {
        if (message.sender_id !== user.id && !message.read) {
          const messageElement = document.getElementById(message.id);
          if (messageElement) {
            const messageRect = messageElement.getBoundingClientRect();
            if (
              messageRect.top >= chatRect.top &&
              messageRect.bottom <= chatRect.bottom
            ) {
              visibleMessages.push(message.id);
            }
          }
        }
      });

      const formData = new FormData();
      formData.append("readMessages", JSON.stringify(visibleMessages));
      formData.append("dialog_id", dialog.id);
      const response = await axios.patch("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        readMessages: visibleMessages,
      });
      console.log(response.data);
      console.log("Sending request to server with:", visibleMessages);
    }
  }

  return (
    <>
      <div
        className={styles["dialog__messages"]}
        ref={scrollChat}
        onScroll={handleDebounce}
      >
        {dialog.messages.map((message) => {
          if (message.sender_id === user.id) {
            return (
              <MessageUser
                key={message.id}
                message={message}
                inputRef={inputRef}
              />
            );
          } else {
            return <MessageMate key={message.id} message={message} />;
          }
        })}
      </div>
      <div className={styles["dialog__input-message"]}>
        <Modal inputRef={inputRef} />
        <Input inputRef={inputRef} />
      </div>
    </>
  );
}
