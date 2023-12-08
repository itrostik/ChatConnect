import styles from "./Messages.module.scss";
import { getDate } from "../../../../utils/date.ts";
import { UserType } from "../../../../@types/userType.ts";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageType } from "../../../../@types/messageType.ts";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store.ts";
import ContentLoader from "react-content-loader";

export default function Messages({
  user,
  isScrolling,
  setIsScrolling,
}: {
  user: UserType;
  isScrolling: boolean;
  setIsScrolling: React.Dispatch<boolean>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState<string>(null);
  const scrollChat = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeMessage, setActiveMessage] = useState<MessageType>(null);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dialog = useSelector((state: RootState) => state.dialog);

  const [reset, setReset] = useState<boolean>(false);

  async function sendMessage() {
    if (inputRef.current.value.trim().length > 0 && !isUpdate) {
      await axios.post("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        messageText: inputRef.current.value,
        imageUrl: null,
      });
    } else if (
      inputRef.current.value.trim().length > 0 &&
      isUpdate &&
      activeMessage.messageText !== inputRef.current.value.trim()
    ) {
      await axios.put("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        message_id: activeMessage.id,
        messageText: inputRef.current.value,
        imageUrl: null,
      });
    }
    inputRef.current.value = "";
    setImageUrl(null);
    setIsUpdate(false);
    setInputValue(null);
  }

  async function sendMessageWithImage() {
    if (((imageUrl && !reset) || inputValue.trim().length > 0) && !isUpdate) {
      await axios.post("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        messageText: inputValue,
        imageUrl: reset ? null : imageUrl,
      });
    } else if (
      ((imageUrl && !reset) || inputValue.trim().length > 0) &&
      isUpdate
      // activeMessage.messageText !== inputValue.trim()
    ) {
      await axios.put("http://localhost:4444/api/messages", {
        dialog_id: dialog.id,
        sender_id: user.id,
        message_id: activeMessage.id,
        messageText: inputValue,
        imageUrl: reset ? null : imageUrl,
      });
    }
    setImageUrl(null);
    setIsUpdate(false);
    setInputValue(null);
    setReset(false);
  }

  async function handleFileChange(event) {
    setIsLoading(true);
    setImageUrl(null);
    try {
      console.log(event);
      const formData = new FormData();
      if (event.target.files[0])
        formData.append("image", event.target.files[0]);
      console.log(event.target.files[0]);
      const response = await axios.post(
        "http://localhost:4444/api/upload",
        formData,
      );
      if (response.data.imageUrl) {
        setImageUrl(response.data.imageUrl);
        setInputValue(inputRef.current.value);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoading(false);
      setReset(false);
      inputRef.current.value = "";
    }
  }

  useEffect(() => {
    document.addEventListener("click", () => {
      setOpenModal(false);
    });
    return () => {
      document.removeEventListener("click", () => {
        setOpenModal(false);
      });
      setIsScrolling(true);
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
      isScrolling
    ) {
      setIsScrolling(false);
      scrollChat.current.scrollTo({
        top: scrollChat?.current.scrollHeight,
      });
    }
    localStorage.setItem("messages", JSON.stringify(dialog.messages));
  }, [dialog.messages.length]);

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
    if (message.imageUrl) {
      setImageUrl(message.imageUrl);
      setInputValue(message.messageText);
    } else {
      inputRef.current.value = message.messageText;
    }
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

  function writeMessageWithImage(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      sendMessageWithImage();
    }
  }

  function resetImage() {
    setReset(true);
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
                  {message.imageUrl ? (
                    <div className={styles["message-user-image"]}>
                      <img src={message.imageUrl} alt="" />
                    </div>
                  ) : (
                    ""
                  )}
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
        {isLoading ? (
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
        {imageUrl ? (
          <div className={styles["dialog__input-modal"]}>
            <div className={styles["dialog__input-window"]}>
              <div className={styles["dialog__input-image"]}>
                {reset ? (
                  <div className={styles["dialog__wrapper"]}>
                    <span className={styles["input__head"]}>
                      Загрузите файл c компьютера
                    </span>
                    <input
                      name="file"
                      type="file"
                      id="input__file"
                      className={[styles["input"], styles["dialog__file"]].join(
                        " ",
                      )}
                      onChange={handleFileChange}
                      accept={".jpg, .jpeg, .png"}
                    />
                    <label
                      htmlFor="input__file"
                      className={styles["dialog__file-button"]}
                    >
                      <span className={styles["dialog__file-icon-wrapper"]}>
                        <img
                          className={styles["input__file-icon"]}
                          src="/img/download.svg"
                          alt="Выбрать файл"
                          width="25"
                        />
                      </span>
                    </label>
                  </div>
                ) : (
                  <img src={imageUrl} alt="" />
                )}
                <div className={styles["dialog__input-buttons"]}>
                  <div className={styles["dialog__input-editImage"]}>
                    <div className={styles["input__wrapper"]}>
                      <input
                        name="file"
                        type="file"
                        id="input__file"
                        className={[
                          styles["input"],
                          styles["input__file"],
                        ].join(" ")}
                        onChange={handleFileChange}
                        accept={".jpg, .jpeg, .png"}
                      />
                      <label
                        htmlFor="input__file"
                        className={styles["input__file-button"]}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          id="refresh"
                        >
                          <path d="M21 21a1 1 0 0 1-1-1V16H16a1 1 0 0 1 0-2h5a1 1 0 0 1 1 1v5A1 1 0 0 1 21 21zM8 10H3A1 1 0 0 1 2 9V4A1 1 0 0 1 4 4V8H8a1 1 0 0 1 0 2z"></path>
                          <path d="M12 22a10 10 0 0 1-9.94-8.89 1 1 0 0 1 2-.22 8 8 0 0 0 15.5 1.78 1 1 0 1 1 1.88.67A10 10 0 0 1 12 22zM20.94 12a1 1 0 0 1-1-.89A8 8 0 0 0 4.46 9.33a1 1 0 1 1-1.88-.67 10 10 0 0 1 19.37 2.22 1 1 0 0 1-.88 1.1z"></path>
                        </svg>
                      </label>
                    </div>
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
                value={inputValue}
                onKeyDown={(event) => writeMessageWithImage(event)}
                onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setInputValue(event.target.value)
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
        <div className={styles["input__wrapper"]}>
          <input
            name="file"
            type="file"
            id="input__file"
            className={[styles["input"], styles["input__file"]].join(" ")}
            onChange={handleFileChange}
            accept={".jpg, .jpeg, .png"}
          />
          <label htmlFor="input__file" className={styles["input__file-button"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="plus"
              className={styles["dialog__input-addFile"]}
            >
              <path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"></path>
            </svg>
          </label>
        </div>
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
