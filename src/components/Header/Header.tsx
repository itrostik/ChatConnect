import React, { useEffect, useRef, useState } from "react";
import { UserType } from "../../../@types/userType.ts";
import styles from "./Header.module.scss";
import axios from "axios";

import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store.ts";
import { change } from "../../../redux/slices/themeSlice.ts";
import { useNavigate } from "react-router-dom";
import { choose } from "../../../redux/slices/dialogSlice.ts";
import { DialogType } from "../../../@types/dialogType.ts";
import { themes } from "../../../constants/theme.ts";

const Header = ({ user }: { user: UserType }) => {
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const [users, setUsers] = useState<UserType[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [openModalTheme, setOpenModalTheme] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener("click", () => {
      setOpenModal(false);
      setOpenModalTheme(false);
    });
    return () => {
      document.removeEventListener("click", () => {
        setOpenModal(false);
        setOpenModalTheme(false);
      });
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function search() {
    if (inputRef.current.value.trim().length > 0) {
      const response = await axios.get<UserType[]>(
        "http://localhost:4444/api/users",
      );
      let users = response.data;
      users = users.filter((user) =>
        user.username.includes(inputRef.current.value),
      );
      users = users.filter((userItem) => userItem.id !== user.id);
      setOpenModal(true);
      setUsers(users);
    } else {
      setOpenModal(false);
      setUsers([]);
    }
  }

  const debounceHandler = _.debounce(search, 300);

  function exit() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  async function chooseDialog(
    event: React.MouseEvent<HTMLDivElement>,
    userId: string,
  ) {
    event.stopPropagation();
    const response = await axios.get<DialogType[]>(
      `http://localhost:4444/api/dialogs/user/${user.id}`,
    );
    const dialogs = response.data;
    const dialog = dialogs.find(
      (dialog) => dialog.user_id === userId || dialog.user2_id === userId,
    );
    if (dialog) {
      dispatch(choose(dialog));
    } else {
      const newDialog = await axios.post<DialogType>(
        "http://localhost:4444/api/dialogs",
        {
          user_id: user.id,
          user2_id: userId,
        },
      );
      dispatch(choose(newDialog.data));
    }
    reset();
  }

  function reset() {
    inputRef.current.value = "";
    setOpenModal(false);
  }

  function changeTheme(
    event: React.MouseEvent<HTMLDivElement>,
    themeName: string,
  ) {
    event.stopPropagation();
    setOpenModalTheme(!openModalTheme);
    if (themeName) {
      dispatch(change(themeName));
    }
  }

  return (
    <header className={styles["header"]}>
      <div className={styles["header__logo"]}>
        <span>ChatConnect</span>
        {theme === "christmas" ? (
          <img
            src="/img/santa-hat.svg"
            alt=""
            className={styles["header__santa"]}
          />
        ) : (
          ""
        )}
      </div>
      <div className={styles["header__search"]}>
        <label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            id="search"
          >
            <path
              fill="#000000"
              d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"
            ></path>
          </svg>

          <input
            type="text"
            placeholder={"Поиск"}
            ref={inputRef}
            onInput={() => debounceHandler()}
          />
          <div onClick={() => reset()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="close"
            >
              <path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
            </svg>
          </div>
        </label>
        {openModal && users.length > 0 ? (
          <div className={styles["header__search-modal"]}>
            {users.map((user) => (
              <div
                className={styles["header__modal-user"]}
                onClick={(event) => chooseDialog(event, user.id)}
                key={user.id}
              >
                <div className={styles["modal-user__image"]}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="user" />
                  ) : (
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={styles["image-user"]}
                    >
                      <path
                        d="M15 2.5C12.5756 2.50461 10.2049 3.21414 8.17654 4.54217C6.14822 5.87021 4.54987 7.75943 3.57618 9.97971C2.60248 12.2 2.29547 14.6555 2.69253 17.0472C3.0896 19.4389 4.1736 21.6635 5.8125 23.45C6.98303 24.7188 8.40368 25.7314 9.98492 26.424C11.5662 27.1166 13.2737 27.4742 15 27.4742C16.7263 27.4742 18.4338 27.1166 20.0151 26.424C21.5963 25.7314 23.017 24.7188 24.1875 23.45C25.8264 21.6635 26.9104 19.4389 27.3075 17.0472C27.7045 14.6555 27.3975 12.2 26.4238 9.97971C25.4501 7.75943 23.8518 5.87021 21.8235 4.54217C19.7951 3.21414 17.4244 2.50461 15 2.5ZM15 25C12.4106 24.9961 9.92364 23.9878 8.0625 22.1875C8.62755 20.8119 9.58879 19.6354 10.8241 18.8074C12.0593 17.9793 13.5129 17.5373 15 17.5373C16.4871 17.5373 17.9407 17.9793 19.1759 18.8074C20.4112 19.6354 21.3724 20.8119 21.9375 22.1875C20.0764 23.9878 17.5894 24.9961 15 25ZM12.5 12.5C12.5 12.0055 12.6466 11.5222 12.9213 11.1111C13.196 10.7 13.5865 10.3795 14.0433 10.1903C14.5001 10.0011 15.0028 9.95157 15.4877 10.048C15.9727 10.1445 16.4181 10.3826 16.7678 10.7322C17.1174 11.0819 17.3555 11.5273 17.452 12.0123C17.5484 12.4972 17.4989 12.9999 17.3097 13.4567C17.1205 13.9135 16.8 14.304 16.3889 14.5787C15.9778 14.8534 15.4945 15 15 15C14.337 15 13.7011 14.7366 13.2322 14.2678C12.7634 13.7989 12.5 13.163 12.5 12.5ZM23.6375 20C22.5207 18.0897 20.8018 16.6038 18.75 15.775C19.3865 15.0533 19.8012 14.1633 19.9443 13.2118C20.0875 12.2603 19.9531 11.2876 19.5572 10.4106C19.1613 9.5336 18.5207 8.78945 17.7124 8.26746C16.904 7.74547 15.9622 7.46781 15 7.46781C14.0378 7.46781 13.096 7.74547 12.2876 8.26746C11.4793 8.78945 10.8387 9.5336 10.4428 10.4106C10.0469 11.2876 9.91248 12.2603 10.0557 13.2118C10.1988 14.1633 10.6135 15.0533 11.25 15.775C9.19825 16.6038 7.47934 18.0897 6.3625 20C5.47243 18.4839 5.00215 16.7581 5 15C5 12.3478 6.05357 9.8043 7.92893 7.92893C9.8043 6.05357 12.3478 5 15 5C17.6522 5 20.1957 6.05357 22.0711 7.92893C23.9464 9.8043 25 12.3478 25 15C24.9979 16.7581 24.5276 18.4839 23.6375 20Z"
                        fill="black"
                      />
                    </svg>
                  )}
                </div>
                <div className={styles["modal-user__name"]}>
                  {user.username}
                </div>
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
      <div
        className={styles["header__theme"]}
        onClick={(event) => changeTheme(event, "")}
      >
        <div className={styles["header__theme-img"]}></div>
        {openModalTheme ? (
          <div className={styles["header__theme-modal"]}>
            {themes.map((themeItem) => {
              if (themeItem.key !== theme) {
                return (
                  <div
                    className={styles["header__theme-block"]}
                    key={themeItem.key}
                    onClick={(event) => changeTheme(event, themeItem.key)}
                    title={themeItem.value}
                  >
                    <img src={themeItem.imgUrl} alt="" />
                  </div>
                );
              }
            })}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className={styles["header__user"]} onClick={() => console.log()}>
        {user?.avatarUrl ? (
          <img src={user?.avatarUrl} alt="" className={styles["image-user"]} />
        ) : (
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles["image-user"]}
          >
            <path
              d="M15 2.5C12.5756 2.50461 10.2049 3.21414 8.17654 4.54217C6.14822 5.87021 4.54987 7.75943 3.57618 9.97971C2.60248 12.2 2.29547 14.6555 2.69253 17.0472C3.0896 19.4389 4.1736 21.6635 5.8125 23.45C6.98303 24.7188 8.40368 25.7314 9.98492 26.424C11.5662 27.1166 13.2737 27.4742 15 27.4742C16.7263 27.4742 18.4338 27.1166 20.0151 26.424C21.5963 25.7314 23.017 24.7188 24.1875 23.45C25.8264 21.6635 26.9104 19.4389 27.3075 17.0472C27.7045 14.6555 27.3975 12.2 26.4238 9.97971C25.4501 7.75943 23.8518 5.87021 21.8235 4.54217C19.7951 3.21414 17.4244 2.50461 15 2.5ZM15 25C12.4106 24.9961 9.92364 23.9878 8.0625 22.1875C8.62755 20.8119 9.58879 19.6354 10.8241 18.8074C12.0593 17.9793 13.5129 17.5373 15 17.5373C16.4871 17.5373 17.9407 17.9793 19.1759 18.8074C20.4112 19.6354 21.3724 20.8119 21.9375 22.1875C20.0764 23.9878 17.5894 24.9961 15 25ZM12.5 12.5C12.5 12.0055 12.6466 11.5222 12.9213 11.1111C13.196 10.7 13.5865 10.3795 14.0433 10.1903C14.5001 10.0011 15.0028 9.95157 15.4877 10.048C15.9727 10.1445 16.4181 10.3826 16.7678 10.7322C17.1174 11.0819 17.3555 11.5273 17.452 12.0123C17.5484 12.4972 17.4989 12.9999 17.3097 13.4567C17.1205 13.9135 16.8 14.304 16.3889 14.5787C15.9778 14.8534 15.4945 15 15 15C14.337 15 13.7011 14.7366 13.2322 14.2678C12.7634 13.7989 12.5 13.163 12.5 12.5ZM23.6375 20C22.5207 18.0897 20.8018 16.6038 18.75 15.775C19.3865 15.0533 19.8012 14.1633 19.9443 13.2118C20.0875 12.2603 19.9531 11.2876 19.5572 10.4106C19.1613 9.5336 18.5207 8.78945 17.7124 8.26746C16.904 7.74547 15.9622 7.46781 15 7.46781C14.0378 7.46781 13.096 7.74547 12.2876 8.26746C11.4793 8.78945 10.8387 9.5336 10.4428 10.4106C10.0469 11.2876 9.91248 12.2603 10.0557 13.2118C10.1988 14.1633 10.6135 15.0533 11.25 15.775C9.19825 16.6038 7.47934 18.0897 6.3625 20C5.47243 18.4839 5.00215 16.7581 5 15C5 12.3478 6.05357 9.8043 7.92893 7.92893C9.8043 6.05357 12.3478 5 15 5C17.6522 5 20.1957 6.05357 22.0711 7.92893C23.9464 9.8043 25 12.3478 25 15C24.9979 16.7581 24.5276 18.4839 23.6375 20Z"
              fill="black"
            />
          </svg>
        )}
      </div>
      <div className={styles["header__exit"]} onClick={() => exit()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          data-name="Layer 1"
          viewBox="0 0 32 32"
          id="exit"
        >
          <path
            fill="#fff"
            d="m16.49 21.49 1.21 1.21 6.71-6.7-6.7-6.71-1.21 1.21 3.09 3.17A6 6 0 0 0 21.47 15h.06H1v2h20.53-.1a6 6 0 0 0-1.84 1.28Z"
          ></path>
          <path fill="#fff" d="M9 3v6h2V5h16v22H11v-4H9v6h20V3H9z"></path>
        </svg>
      </div>
    </header>
  );
};

export default Header;
