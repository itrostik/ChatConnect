import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

import {Inputs} from "../@types/types.ts";


const Login = ({setUser}) => {
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
    <div>
      <h1>Войти</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" defaultValue='' {...register("login", {required: true, maxLength: 30})} placeholder='Логин'/>
        <input type="password" defaultValue='' {...register("password", {required: true, maxLength: 30})}  placeholder='Пароль'/>
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default Login;