import {useForm, SubmitHandler} from "react-hook-form";
import axios from "axios";

import {Inputs} from "../@types/types.ts";


const Register = ({setUser}) => {
  const {
    register,
    handleSubmit,
    formState: {errors, isValid}
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
    }
    else {
      setUser(user.data)
      localStorage.setItem("user", JSON.stringify(user.data))
    }
  }
  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("login", {required: true, maxLength: 30})} placeholder='Логин'/>
        <input type="text" {...register("username", {required: true, maxLength: 30})} placeholder='Юзернейм'/>
        <input type="text" {...register("firstName", {required: true, maxLength: 30})} placeholder='Имя'/>
        <input type="text" {...register("lastName", {required: true, maxLength: 30})} placeholder='Фамилия'/>
        <input type="password" {...register("password", {required: true, maxLength: 30})} placeholder='Пароль'/>
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default Register;