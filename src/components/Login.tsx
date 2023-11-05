import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";

import {Auth, Inputs} from "../@types/types.ts";
import "../scss/login.scss"
import {useState} from "react";

const Login = ({theme, setUser, setIsLoading}: Auth) => {
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
  console.log(errors)
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    try {
      const user = await axios.post("https://chatconnectapp.netlify.app/api/users/check", {
        "login": data.login,
        "password": data.password
      })
      setUser(user.data)
      localStorage.setItem("user", JSON.stringify(user.data))
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
      event.target.className = "login__input"
      localStorage.removeItem("error")
      setError(null)
    }
    if (event.target.value.length > 30) {
      event.target.className = "error__input login__input"
    } else if (event.target.value.length < 4) {
      event.target.className = "error__input login__input"
    } else {
      event.target.className = "login__input"
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
                   className={!error ? "login__input" : "error__input login__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.login && <p className="error__text">{errors.login.message}</p>}
            <input type="password" {...register("password", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Пароль должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Пароль'
                   className={!error ? "login__input" : "error__input login__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.password && <p className="error__text">{errors.password.message}</p>}
            {error ? <p className="error__text">{error}</p> : ""}
            <button type="submit" className="login__button login__button-dark">Отправить</button>
          </form>
        </> :
        <>
          <h1 className="login__name login__name-light">Войти</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="registration__form">
            <input type="text" {...register("login", {required: true, maxLength: 30})} placeholder='Логин'
                   className={!error ? "login__input" : "error__input login__input"}
                   onChange={(event) => changeInput(event)}/>
            <input type="password" {...register("password", {required: true, maxLength: 30})} placeholder='Пароль'
                   className={!error ? "login__input" : "error__input login__input"}
                   onChange={(event) => changeInput(event)}/>
            {error ? <p className="error__text">{error}</p> : ""}
            <button type="submit" className="login__button login__button-light">Отправить</button>
          </form>
        </>}
    </div>
  );
};

export default Login;