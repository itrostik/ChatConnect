import "../scss/loading.scss";

const Loading = ({ theme }: { theme: String }) => {
  return (
    <div className="loading__block">
      <div
        className={
          theme === "Dark"
            ? "loading__logo light__logo"
            : "loading__logo dark__logo"
        }
      >
        ChatConnect
      </div>
      <div className="loading__text">загрузка...</div>
    </div>
  );
};

export default Loading;