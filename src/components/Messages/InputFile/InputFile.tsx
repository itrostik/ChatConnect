import styles from "./InputFile.module.scss";
import {
  setImageUrl,
  setIsLoading,
  setMessageValue,
  setReset,
} from "../../../../redux/slices/messagesSlice.ts";
import axios from "axios";
import { useDispatch } from "react-redux";
import React from "react";

type InputFileTypes = "refresh" | "add" | "upload";

export default function InputFile({
  type,
  inputRef,
}: {
  type: InputFileTypes;
  inputRef: React.MutableRefObject<HTMLInputElement>;
}) {
  const dispatch = useDispatch();
  async function handleFileChange(event) {
    dispatch(setIsLoading(true));
    dispatch(setImageUrl(null));
    try {
      const formData = new FormData();
      if (event.target.files[0])
        formData.append("image", event.target.files[0]);
      const response = await axios.post(
        "http://localhost:4444/api/upload",
        formData,
      );
      if (response.data.imageUrl) {
        dispatch(setImageUrl(response.data.imageUrl));
        if (inputRef.current.value.trim().length > 0) {
          dispatch(setMessageValue(inputRef.current.value));
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      dispatch(setIsLoading(false));
      dispatch(setReset(false));
      inputRef.current.value = "";
    }
  }

  return (
    <>
      {type === "upload" ? (
        <div className={styles["dialog__wrapper"]}>
          <span className={styles["input__head"]}>
            Загрузите файл c компьютера
          </span>
          <input
            name="file"
            type="file"
            id="input__file"
            className={[styles["input"], styles["dialog__file"]].join(" ")}
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
        <div>
          <div className={styles["input__wrapper"]}>
            <input
              name="file"
              type="file"
              id="input__file"
              className={[styles["input"], styles["input__file"]].join(" ")}
              onChange={handleFileChange}
              accept={".jpg, .jpeg, .png"}
            />
            <label
              htmlFor="input__file"
              className={styles["input__file-button"]}
            >
              {type === "refresh" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="refresh"
                >
                  <path d="M21 21a1 1 0 0 1-1-1V16H16a1 1 0 0 1 0-2h5a1 1 0 0 1 1 1v5A1 1 0 0 1 21 21zM8 10H3A1 1 0 0 1 2 9V4A1 1 0 0 1 4 4V8H8a1 1 0 0 1 0 2z"></path>
                  <path d="M12 22a10 10 0 0 1-9.94-8.89 1 1 0 0 1 2-.22 8 8 0 0 0 15.5 1.78 1 1 0 1 1 1.88.67A10 10 0 0 1 12 22zM20.94 12a1 1 0 0 1-1-.89A8 8 0 0 0 4.46 9.33a1 1 0 1 1-1.88-.67 10 10 0 0 1 19.37 2.22 1 1 0 0 1-.88 1.1z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  id="plus"
                  className={styles["dialog__input-addFile"]}
                >
                  <path d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"></path>
                </svg>
              )}
            </label>
          </div>
        </div>
      )}
    </>
  );
}
