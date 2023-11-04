import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";

import {Auth, Inputs} from "../@types/types.ts";
import "../scss/register.scss"

const Register = ({theme, setUser}: Auth) => {
  const {
    register,
    handleSubmit,
  } = useForm<Inputs>({
    defaultValues: {
      password: '',
      login: '',
      firstName: '',
      lastName: '',
      username: ''
    }
  })
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const user = await axios.post("https://chatconnectapp.netlify.app/api/users", {
      "login": data.login,
      "password": data.password,
      "username": data.username,
      "firstName": data.firstName,
      "lastName": data.lastName,
    })
    if (user.data.message) {
      alert(user.data.message)
    } else {
      setUser(user.data)
      localStorage.setItem("user", JSON.stringify(user.data))
    }
  }
  return (
    <div className="registration">
      {theme === "Dark" ?
        <>
          <h1 className="registration__name registration__name-dark">Регистрация</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="registration__form">
            <input type="text" {...register("login", {required: true, maxLength: 30})} placeholder='Логин' className="registration__input"/>
            <input type="text" {...register("username", {required: true, maxLength: 30})} placeholder='Юзернейм' className="registration__input"/>
            <input type="text" {...register("firstName", {required: true, maxLength: 30})} placeholder='Имя' className="registration__input"/>
            <input type="text" {...register("lastName", {required: true, maxLength: 30})} placeholder='Фамилия' className="registration__input"/>
            <input type="password" {...register("password", {required: true, maxLength: 30})} placeholder='Пароль' className="registration__input"/>
            <button type="submit" className="registration__button registration__button-dark">Отправить</button>
          </form>
        </> :
        <>
          <h1 className="registration__name registration__name-light">Регистрация</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="registration__form">
            <input type="text" {...register("login", {required: true, maxLength: 30})} placeholder='Логин' className="registration__input"/>
            <input type="text" {...register("username", {required: true, maxLength: 30})} placeholder='Юзернейм' className="registration__input"/>
            <input type="text" {...register("firstName", {required: true, maxLength: 30})} placeholder='Имя' className="registration__input"/>
            <input type="text" {...register("lastName", {required: true, maxLength: 30})} placeholder='Фамилия' className="registration__input"/>
            <input type="password" {...register("password", {required: true, maxLength: 30})} placeholder='Пароль' className="registration__input"/>
            <button type="submit" className="registration__button registration__button-light">Отправить</button>
          </form>
        </>}
    </div>
  );
};

export default Register;