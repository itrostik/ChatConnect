import styles from "./Login.module.scss";
import { Link, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Inputs } from "../../../@types/inputType.ts";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { change } from "../../../redux/slices/userSlice.ts";
import { jwtDecode } from "jwt-decode";
import { RootState } from "../../../redux/store.ts";

export default function Login({
  setIsLoading,
}: {
  setIsLoading: React.Dispatch<boolean>;
}) {
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }
  const [error, setError] = useState(localStorage.getItem("error"));
  const [data, setData] = useState(JSON.parse(localStorage.getItem("data")));
  const theme = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      password: data?.password,
      login: data?.login,
    },
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const token = await axios.post("http://localhost:4444/api/users/check", {
        login: data.login,
        password: data.password,
      });
      localStorage.setItem("token", JSON.stringify(token.data.token));
      localStorage.removeItem("error");
      localStorage.removeItem("data");
      setIsLoading(false);
      const user = jwtDecode(token.data.token);
      dispatch(change(user));
    } catch (err) {
      const dataOptions = {
        login: data.login,
        password: data.password,
      };
      setData(dataOptions);
      setError(err.response.data.message);
      localStorage.setItem("error", err.response.data.message);
      localStorage.setItem("data", JSON.stringify(dataOptions));
      setIsLoading(false);
    }
  };

  function navigate() {
    localStorage.removeItem("data");
    localStorage.removeItem("error");
  }

  console.log(Object.keys(errors));
  return (
    <div className={styles["login"]}>
      <>
        <h1 className={styles["login__name"]}>Войти</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles["login__form"]}
        >
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
                ? styles["login__input"]
                : styles["error__input"]
            }
          />
          {errors.login && (
            <p className={styles["error__text"]}>{errors.login.message}</p>
          )}
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
                ? styles["login__input"]
                : styles["error__input"]
            }
          />
          {errors.password && (
            <p className={styles["error__text"]}>{errors.password.message}</p>
          )}
          {error ? <p className={styles["error__text"]}>{error}</p> : ""}
          <button type="submit" className={styles["login__button"]}>
            Отправить
          </button>
          <div className={styles["login__text"]}>
            Нет аккаунта?{" "}
            <Link
              to="/registration"
              onClick={() => navigate()}
              className={styles["login__link"]}
            >
              Регистрация
            </Link>
          </div>
        </form>
      </>
    </div>
  );
}
