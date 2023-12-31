import styles from "./Register.module.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InputsType } from "../../../@types/inputType.ts";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { change } from "../../../redux/slices/userSlice.ts";
import { RootState } from "../../../redux/store.ts";

export default function Register({
  setIsLoading,
}: {
  setIsLoading: React.Dispatch<boolean>;
}) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  if (localStorage.getItem("data")) {
    setImageUrl(JSON.parse(localStorage.getItem("data")).avatarUrl);
  }
  const [error, setError] = useState(localStorage.getItem("error"));
  const [data, setData] = useState(JSON.parse(localStorage.getItem("data")));
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const theme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsType>({
    defaultValues: {
      avatarUrl: imageUrl,
      password: data?.password,
      login: data?.login,
      firstName: data?.firstName,
      lastName: data?.lastName,
      username: data?.username,
    },
    mode: "onChange",
  });

  function navigate() {
    localStorage.removeItem("data");
    localStorage.removeItem("error");
  }

  const onSubmit: SubmitHandler<InputsType> = async (data) => {
    setIsLoading(true);
    try {
      const token = await axios.post(
        "https://chatconnectapp.netlify.app/api/users",
        {
          login: data.login,
          password: data.password,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: imageUrl,
        },
      );
      localStorage.setItem("token", JSON.stringify(token.data.token));
      localStorage.removeItem("data");
      setIsLoading(false);
      const user = jwtDecode(token.data.token);
      dispatch(change(user));
    } catch (err) {
      const dataOptions = {
        login: data.login,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        avatarUrl: imageUrl,
      };
      setData(dataOptions);
      setError(err.response.data.message);
      localStorage.setItem("error", err.response.data.message);
      localStorage.setItem("data", JSON.stringify(dataOptions));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const setImage = async () => {
      if (selectedFile) {
        await handleUpload();
      }
    };
    setImage();
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleUpload = async () => {
    try {
      setIsLoadingImage(true);
      const formData = new FormData();
      if (selectedFile) formData.append("image", selectedFile);
      const response = await axios.post(
        "https://chatconnectapp.netlify.app/api/upload",
        formData,
      );
      if (response.data.imageUrl) {
        setImageUrl(response.data.imageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsLoadingImage(false);
    }
  };

  function changeUrl(event) {
    setImageUrl(event.target.value);
  }

  return (
    <div className={styles["registration"]}>
      <>
        <h1 className={styles["registration__name"]}>
          <span>Регистрация</span>
          {theme === "christmas" ? <img src="/img/santa.svg" alt="" /> : ""}
        </h1>
        <div className={styles["input__wrapper"]}>
          <span className={styles["input__head"]}>
            Загрузите файл c компьютера
          </span>
          <input
            name="file"
            type="file"
            id="input__file"
            className={[styles["input"], styles["input__file"]].join(" ")}
            onChange={handleFileChange}
            accept={".jpg, .jpeg, .png"}
            disabled={isLoadingImage}
          />
          <label htmlFor="input__file" className={styles["input__file-button"]}>
            <span className={styles["input__file-icon-wrapper"]}>
              <img
                className={styles["input__file-icon"]}
                src="/img/download.svg"
                alt="Выбрать файл"
                width="25"
              />
            </span>
            <span className={styles["input__file-button-text"]}>
              {!isLoadingImage ? "Выберите файл" : "Загрузка..."}
            </span>
          </label>
        </div>
        <span className={styles["input__head"]}>
          Или вставьте ссылку на картинку
        </span>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["registration__form"]}
        >
          <label className={styles["label"]}>
            <input
              type="text"
              value={imageUrl}
              {...register("avatarUrl", {
                required: false,
              })}
              placeholder={"Ссылка на аватарку (необязательно)"}
              className={styles["registration__input"]}
              onInput={(event) => changeUrl(event)}
            />
            {imageUrl ? (
              <img src={imageUrl} className={styles["image"]}></img>
            ) : (
              ""
            )}
            {theme === "christmas" ? (
              <img
                src="/img/santa-hat.svg"
                alt=""
                className={styles["santa-hat"]}
              />
            ) : (
              ""
            )}
          </label>
          <label htmlFor="">
            <input
              type="text"
              {...register("firstName", {
                required: "Поле не может быть пустым",
                minLength: {
                  value: 2,
                  message: "Имя должно быть от 2 до 50 символов",
                },
                maxLength: { value: 50, message: "Слишком много символов" },
              })}
              placeholder="Имя"
              className={
                !Object.keys(errors).includes("firstName")
                  ? styles["registration__input"]
                  : styles["error__input"]
              }
            />
            {theme === "christmas" ? (
              <img
                src="/img/santa-hat.svg"
                alt=""
                className={styles["santa-hat"]}
              />
            ) : (
              ""
            )}
          </label>
          {errors.firstName && (
            <p className={styles["error__text"]}>{errors.firstName.message}</p>
          )}
          <label htmlFor="">
            <input
              type="text"
              {...register("lastName", {
                required: "Поле не может быть пустым",
                minLength: {
                  value: 2,
                  message: "Фамилия должна быть от 2 до 50 символов",
                },
                maxLength: { value: 50, message: "Слишком много символов" },
              })}
              placeholder="Фамилия"
              className={
                !Object.keys(errors).includes("lastName")
                  ? styles["registration__input"]
                  : styles["error__input"]
              }
            />
            {theme === "christmas" ? (
              <img
                src="/img/santa-hat.svg"
                alt=""
                className={styles["santa-hat"]}
              />
            ) : (
              ""
            )}
          </label>
          {errors.lastName && (
            <p className={styles["error__text"]}>{errors.lastName.message}</p>
          )}
          <label htmlFor="">
            <input
              type="text"
              {...register("username", {
                required: "Поле не может быть пустым",
                minLength: {
                  value: 2,
                  message: "Никнейм должен быть от 2 до 50 символов",
                },
                maxLength: { value: 50, message: "Слишком много символов" },
              })}
              placeholder="Никнейм"
              className={
                !Object.keys(errors).includes("username")
                  ? styles["registration__input"]
                  : styles["error__input"]
              }
            />
            {theme === "christmas" ? (
              <img
                src="/img/santa-hat.svg"
                alt=""
                className={styles["santa-hat"]}
              />
            ) : (
              ""
            )}
          </label>

          {errors.username && (
            <p className={styles["error__text"]}>{errors.username.message}</p>
          )}
          <label htmlFor="">
            <input
              type="text"
              {...register("login", {
                required: "Поле не может быть пустым",
                minLength: {
                  value: 4,
                  message: "Логин должен быть от 4 до 30 символов",
                },
                maxLength: { value: 30, message: "Слишком много символов" },
              })}
              placeholder="Логин"
              className={
                !Object.keys(errors).includes("login")
                  ? styles["registration__input"]
                  : styles["error__input"]
              }
            />
            {theme === "christmas" ? (
              <img
                src="/img/santa-hat.svg"
                alt=""
                className={styles["santa-hat"]}
              />
            ) : (
              ""
            )}
          </label>

          {errors.login && (
            <p className={styles["error__text"]}>{errors.login.message}</p>
          )}
          <label htmlFor="">
            <input
              type="password"
              {...register("password", {
                required: "Поле не может быть пустым",
                minLength: {
                  value: 4,
                  message: "Пароль должен быть от 4 до 30 символов",
                },
                maxLength: { value: 30, message: "Слишком много символов" },
              })}
              placeholder="Пароль"
              className={
                !Object.keys(errors).includes("password")
                  ? styles["registration__input"]
                  : styles["error__input"]
              }
            />
            {theme === "christmas" ? (
              <img
                src="/img/santa-hat.svg"
                alt=""
                className={styles["santa-hat"]}
              />
            ) : (
              ""
            )}
          </label>
          {errors.password && (
            <p className={styles["error__text"]}>{errors.password.message}</p>
          )}

          {error ? <p className={styles["error__text"]}>{error}</p> : ""}

          <button type="submit" className={styles["registration__button"]}>
            <span>Зарегистрироваться</span>
            {theme === "christmas" ? (
              <img src="/img/christmas-tree.svg" alt="" />
            ) : (
              ""
            )}
          </button>
          <div className={styles["registration__text"]}>
            Уже есть аккаунт?{" "}
            <Link
              to="/login"
              onClick={() => navigate()}
              className={styles["registration__link"]}
            >
              Войти
            </Link>
          </div>
        </form>
      </>
    </div>
  );
}
