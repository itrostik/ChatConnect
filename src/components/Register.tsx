import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";

import {Auth, Inputs} from "../@types/types.ts";
import "../scss/register.scss"
import {useState} from "react";
import {Link, Navigate} from "react-router-dom";

const Register = ({theme, token, setToken, setIsLoading}: Auth) => {
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
      firstName: data?.firstName,
      lastName: data?.lastName,
      username: data?.username
    },
    mode: "onChange"
  })
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true)
    try {
      const token = await axios.post("https://chatconnectapp.netlify.app/api/users", {
        "login": data.login,
        "password": data.password,
        "username": data.username,
        "firstName": data.firstName,
        "lastName": data.lastName,
      })
      setToken(token.data.token)
      localStorage.setItem("token", JSON.stringify(token.data.token))
      localStorage.removeItem("data")
      setIsLoading(false)
    } catch (err) {
      const dataOptions = {
        login: data.login,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username
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
      event.target.className = "registration__input"
      localStorage.removeItem("error")
      setError(null)
    }
    if (event.target.placeholder === "Имя" || event.target.placeholder === "Фамилия" || event.target.placeholder === "Никнейм") {
      if (event.target.value.length > 50 || event.target.value.length < 2) {
        event.target.className = "error__input registration__input"
      } else {
        if (theme === "Dark") {
          event.target.className = "registration__input registration__input-dark"
        } else {
          event.target.className = "registration__input registration__input-light"
        }
      }
    } else {
      if (event.target.value.length > 30 || event.target.value.length < 4) {
        event.target.className = "error__input registration__input"
      } else {
        if (theme === "Dark") {
          event.target.className = "registration__input registration__input-dark"
        } else {
          event.target.className = "registration__input registration__input-light"
        }
      }
    }
  }

  return (
    <div className="registration">
      {theme === "Dark" ?
        <>
          <h1 className="registration__name registration__name-dark">Регистрация</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="registration__form">

            <input type="text" {...register("firstName", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Имя должно быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Имя' className={!error ? "registration__input registration__input-dark" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.firstName && <p className="error__text">{errors.firstName.message}</p>}

            <input type="text" {...register("lastName", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Фамилия должна быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Фамилия' className={!error ? "registration__input registration__input-dark" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.lastName && <p className="error__text">{errors.lastName.message}</p>}

            <input type="text" {...register("username", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Никнейм должен быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Никнейм' className={!error ? "registration__input registration__input-dark" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.username && <p className="error__text">{errors.username.message}</p>}

            <input type="text" {...register("login", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Логин должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Логин'
                   className={!error ? "registration__input registration__input-dark" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.login && <p className="error__text">{errors.login.message}</p>}


            <input type="password" {...register("password", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Пароль должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Пароль'
                   className={!error ? "registration__input registration__input-dark" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.password && <p className="error__text">{errors.password.message}</p>}


            {error ? <p className="error__text">{error}</p> : ""}

            <button type="submit" className="registration__button registration__button-dark">Отправить</button>
            <div className="registration__text registration__text-dark">Уже есть аккаунт? <Link to="/login"
                                                                                                className="registration__link registration__link-dark">Войти</Link>
            </div>
          </form>
        </> :
        <>
          <h1 className="registration__name registration__name-light">Регистрация</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="registration__form">

            <input type="text" {...register("firstName", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Имя должно быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Имя' className={!error ? "registration__input registration__input-light" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.firstName && <p className="error__text">{errors.firstName.message}</p>}

            <input type="text" {...register("lastName", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Фамилия должна быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Фамилия' className={!error ? "registration__input registration__input-light" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.lastName && <p className="error__text">{errors.lastName.message}</p>}

            <input type="text" {...register("username", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Никнейм должен быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Никнейм' className={!error ? "registration__input registration__input-light" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.username && <p className="error__text">{errors.username.message}</p>}

            <input type="text" {...register("login", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Логин должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Логин'
                   className={!error ? "registration__input registration__input-light" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.login && <p className="error__text">{errors.login.message}</p>}


            <input type="password" {...register("password", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Пароль должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Пароль'
                   className={!error ? "registration__input registration__input-light" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.password && <p className="error__text">{errors.password.message}</p>}


            {error ? <p className="error__text">{error}</p> : ""}

            <button type="submit" className="registration__button registration__button-light">Отправить</button>
            <div className="registration__text registration__text-light">Уже есть аккаунт? <Link to="/login"
                                                                                                 className="registration__link registration__link-light">Войти</Link>
            </div>
          </form>
        </>}
    </div>
  );
};

export default Register;