import styles from "./LoadingMessage.module.scss";
import { getDate } from "../../../../utils/date.ts";

export default function LoadingMessage({ message }) {
  return (
    <>
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
        className={styles["svg-triangle-load"]}
      >
        <path d="M4 0L0 4.8L11 8L4 0Z" fill="#00d3ff" />
      </svg>
      <div className={styles["message-user__time"]}>
        {getDate(message.created)}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          width={18}
          height={18}
          id="loading"
          className={styles["message-user__load"]}
        >
          <path d="M6.804 15a1 1 0 0 0-1.366-.366l-1.732 1a1 1 0 0 0 1 1.732l1.732-1A1 1 0 0 0 6.804 15ZM3.706 8.366l1.732 1a1 1 0 1 0 1-1.732l-1.732-1a1 1 0 0 0-1 1.732ZM6 12a1 1 0 0 0-1-1H3a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1Zm11.196-3a1 1 0 0 0 1.366.366l1.732-1a1 1 0 1 0-1-1.732l-1.732 1A1 1 0 0 0 17.196 9ZM15 6.804a1 1 0 0 0 1.366-.366l1-1.732a1 1 0 1 0-1.732-1l-1 1.732A1 1 0 0 0 15 6.804Zm5.294 8.83-1.732-1a1 1 0 1 0-1 1.732l1.732 1a1 1 0 0 0 1-1.732Zm-3.928 1.928a1 1 0 1 0-1.732 1l1 1.732a1 1 0 1 0 1.732-1ZM21 11h-2a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2Zm-9 7a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1Zm-3-.804a1 1 0 0 0-1.366.366l-1 1.732a1 1 0 0 0 1.732 1l1-1.732A1 1 0 0 0 9 17.196ZM12 2a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1Z"></path>
        </svg>
      </div>
    </>
  );
}
