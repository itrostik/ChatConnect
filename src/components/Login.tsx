import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";

import {Auth, Inputs} from "../@types/types.ts";
import "../scss/login.scss"

const Login = ({theme, setUser}: Auth) => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: {
      password: '',
      login: '',
    }
  })
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const user = await axios.post("https://chatconnectapp.netlify.app/api/users/check", {
      "login": data.login,
      "password": data.password
    })
    setUser(user.data)
    localStorage.setItem("user", JSON.stringify(user.data))
  }
  return (
    <div className="login">
      {theme === "Dark" ?
        <>
          <h1 className="login__name login__name-dark">Войти</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="login__form">
            <input type="text" {...register("login", {required: true, maxLength: 30})} placeholder='Логин'
                   className="login__input"/>
            <input type="password" {...register("password", {required: true, maxLength: 30})} placeholder='Пароль'
                   className="login__input"/>
            <button type="submit" className="login__button login__button-dark">Отправить</button>
          </form>
        </> :
        <>
          <h1 className="login__name login__name-light">Войти</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="registration__form">
            <input type="text" {...register("login", {required: true, maxLength: 30})} placeholder='Логин'
                   className="login__input"/>
            <input type="password" {...register("password", {required: true, maxLength: 30})} placeholder='Пароль'
                   className="login__input"/>
            <button type="submit" className="login__button login__button-light">Отправить</button>
          </form>
        </>}
    </div>
  );
};

export default Login;