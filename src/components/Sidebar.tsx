import {Dispatch, SetStateAction} from "react";

import "../scss/sidebar.scss"
const Sidebar = ({
                   activeDialog,
                   setActiveDialog,
                   theme,
                 }: {
  activeDialog: string;
  theme: string;
  setActiveDialog: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div
      onClick={() => setActiveDialog("")}
      className={
        theme === "Dark" ? "sidebar sidebar-dark" : "sidebar sidebar-light"
      }
    >
      <div>{activeDialog}</div>
      {theme === "Dark" ? (
        <>
          <div>
            <div className="dialog dialog-dark">
              <div className="dialog__image">
                <img src="/img/user-dark.svg" alt="" />
              </div>
              <div className="dialog__info">
                <div className="dialog__username dialog__username-dark">
                  Name
                </div>
                <div className="dialog__lastmessage">LastMessage</div>
              </div>
            </div>
          </div>
          <div>
            <div className="dialog dialog-dark">
              <div className="dialog__image">
                <img src="/img/user-dark.svg" alt="" />
              </div>
              <div className="dialog__info">
                <div className="dialog__username dialog__username-dark">
                  Name
                </div>
                <div className="dialog__lastmessage">LastMessage</div>
              </div>
            </div>
          </div>
          <div>
            <div className="dialog dialog-dark">
              <div className="dialog__image">
                <img src="/img/user-dark.svg" alt="" />
              </div>
              <div className="dialog__info">
                <div className="dialog__username dialog__username-dark">
                  Name
                </div>
                <div className="dialog__lastmessage">LastMessage</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="dialog dialog-light">
              <div className="dialog__image">
                <img src="/img/user-light.svg" alt="" />
              </div>
              <div className="dialog__info">
                <div className="dialog__username dialog__username-light">
                  Name
                </div>
                <div className="dialog__lastmessage">LastMessage</div>
              </div>
            </div>
          </div>
          <div>
            <div className="dialog dialog-light">
              <div className="dialog__image">
                <img src="/img/user-light.svg" alt="" />
              </div>
              <div className="dialog__info">
                <div className="dialog__username dialog__username-light">
                  Name
                </div>
                <div className="dialog__lastmessage">LastMessage</div>
              </div>
            </div>
          </div>
          <div>
            <div className="dialog dialog-light">
              <div className="dialog__image">
                <img src="/img/user-light.svg" alt="" />
              </div>
              <div className="dialog__info">
                <div className="dialog__username dialog__username-light">
                  Name
                </div>
                <div className="dialog__lastmessage">LastMessage</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;