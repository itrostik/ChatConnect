import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";

import {Auth, Inputs} from "../@types/types.ts";
import "../scss/login.scss"
import {useState} from "react";
import {Link, Navigate} from "react-router-dom";

const Login = ({theme, token, setToken, setIsLoading}: Auth) => {
  if (token) {
    return <Navigate to="/main"/>
  }
  const [error, setError] = useState(localStorage.getItem("error"))
  const [data, setData] = useState(JSON.parse(localStorage.getItem("data")))
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<Inputs>({
    defaultValues: {
      password: data?.password,
      login: data?.login,
    },
    mode: "onChange"
  })
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    try {
      const token = await axios.post("https://chatconnectapp.netlify.app/api/users/check", {
        "login": data.login,
        "password": data.password
      })
      setToken(token.data.token)
      localStorage.setItem("token", JSON.stringify(token.data.token))
      localStorage.removeItem("error")
      localStorage.removeItem("data")
      setIsLoading(false)
    } catch (err) {
      const dataOptions = {
        login: data.login,
        password: data.password
      }
      setData(dataOptions)
      setError(err.response.data.message)
      localStorage.setItem("error", err.response.data.message)
      localStorage.setItem("data", JSON.stringify(dataOptions))
      setIsLoading(false)
    }
  }


  function changeInput(event: any) {
    if (localStorage.getItem("error")) {
      event.target.className = "login__input login__input-dark"
      localStorage.removeItem("error")
      setError(null)
    }
    if (event.target.value.length > 30) {
      event.target.className = "error__input login__input"
    } else if (event.target.value.length < 4) {
      event.target.className = "error__input login__input"
    } else {
      if (theme === "Dark") {
        event.target.className = "login__input login__input-dark"
      }
      else {
        event.target.className = "login__input login__input-light"
      }
    }
  }
  return (
    <div className="login">
      {theme === "Dark" ?
        <>
          <h1 className="login__name login__name-dark">Войти</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="login__form">
            <input type="text" {...register("login", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Логин должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Логин'
                   className={!error ? "login__input login__input-dark" : "error__input login__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.login && <p className="error__text">{errors.login.message}</p>}
            <input type="password" {...register("password", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Пароль должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Пароль'
                   className={!error ? "login__input login__input-dark" : "error__input login__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.password && <p className="error__text">{errors.password.message}</p>}
            {error ? <p className="error__text">{error}</p> : ""}
            <button type="submit" className="login__button login__button-dark">Отправить</button>
            <div className="login__text login__text-dark">Нет аккаунта? <Link to="/registration" className="login__link login__link-dark">Регистрация</Link></div>

          </form>
        </> :
        <>
          <h1 className="login__name login__name-light">Войти</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="login__form">
            <input type="text" {...register("login", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Логин должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Логин'
                   className={!error ? "login__input login__input-light" : "error__input login__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.login && <p className="error__text">{errors.login.message}</p>}
            <input type="password" {...register("password", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Пароль должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Пароль'
                   className={!error ? "login__input login__input-light" : "error__input login__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.password && <p className="error__text">{errors.password.message}</p>}
            {error ? <p className="error__text">{error}</p> : ""}
            <button type="submit" className="login__button login__button-light">Отправить</button>
            <div className="login__text login__text-light">Нет аккаунта? <Link to="/registration" className="login__link login__link-light">Регистрация</Link></div>
          </form>
        </>}
    </div>
  );
};

export default Login;