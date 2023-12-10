import styles from "./MessageMate.module.scss";
import { getDate } from "../../../../utils/date.ts";

export default function MessageMate({ message }) {
  return (
    <div id={message.id} className={styles["message-mate"]}>
      <div className={styles["message-mate__text"]}>
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
        <path d="M7 0L11 4.5L0 7.5L7 0Z" fill="#7C00A9" />
      </svg>
      <div className={styles["message-user__time"]}>
        {getDate(message.created)}
        {message.updated ? (
          <div className={styles["message-mate__edited"]}>(изменено)</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
