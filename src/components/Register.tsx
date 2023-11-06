import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";

import {Auth, Inputs} from "../@types/types.ts";
import "../scss/register.scss"
import {useState} from "react";

const Register = ({theme, setToken, setIsLoading}: Auth) => {
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
      if (event.target.value.length > 50) {
        event.target.className = "error__input registration__input"
      } else if (event.target.value.length < 2) {
        event.target.className = "error__input registration__input"
      } else {
        event.target.className = "registration__input"
      }
    } else {
      if (event.target.value.length > 30) {
        event.target.className = "error__input registration__input"
      } else if (event.target.value.length < 4) {
        event.target.className = "error__input registration__input"
      } else {
        event.target.className = "registration__input"
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
            })} placeholder='Имя' className={!error ? "registration__input" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.firstName && <p className="error__text">{errors.firstName.message}</p>}

            <input type="text" {...register("lastName", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Фамилия должна быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Фамилия' className={!error ? "registration__input" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.lastName && <p className="error__text">{errors.lastName.message}</p>}

            <input type="text" {...register("username", {
              required: "Поле не может быть пустым",
              minLength: {value: 2, message: "Никнейм должен быть от 2 до 50 символов"},
              maxLength: {value: 50, message: "Слишком много символов"},
            })} placeholder='Никнейм' className={!error ? "registration__input" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.username && <p className="error__text">{errors.username.message}</p>}

            <input type="text" {...register("login", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Логин должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Логин'
                   className={!error ? "registration__input" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>
            {errors.login && <p className="error__text">{errors.login.message}</p>}


            <input type="password" {...register("password", {
              required: "Поле не может быть пустым",
              minLength: {value: 4, message: "Пароль должен быть от 4 до 30 символов"},
              maxLength: {value: 30, message: "Слишком много символов"},
            })} placeholder='Пароль'
                   className={!error ? "registration__input" : "error__input registration__input"}
                   onInput={(event) => changeInput(event)}/>

            {errors.password && <p className="error__text">{errors.password.message}</p>}


            {error ? <p className="error__text">{error}</p> : ""}

            <button type="submit" className="registration__button registration__button-dark">Отправить</button>
          </form>
        </> :
        <>
          <h1 className="registration__name registration__name-light">Регистрация</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="registration__form">
            <input type="text" {...register("login", {required: true, maxLength: 30})} placeholder='Логин'
                   className="registration__input"/>
            <input type="text" {...register("username", {required: true, maxLength: 30})} placeholder='Юзернейм'
                   className="registration__input"/>
            <input type="text" {...register("firstName", {required: true, maxLength: 30})} placeholder='Имя'
                   className="registration__input"/>
            <input type="text" {...register("lastName", {required: true, maxLength: 30})} placeholder='Фамилия'
                   className="registration__input"/>
            <input type="password" {...register("password", {required: true, maxLength: 30})} placeholder='Пароль'
                   className="registration__input"/>
            <button type="submit" className="registration__button registration__button-light">Отправить</button>
          </form>
        </>}
    </div>
  );
};

export default Register;