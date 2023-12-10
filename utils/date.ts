export function getDate(num: number) {
  const dateNow = new Date(Date.now());

  const date = new Date(num);

  if (dateNow.getDate() - date.getDate() !== 0) {
    const days = date.getDate();
    const monthName = date.toLocaleString("default", { month: "short" });
    const hours =
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return days + " " + monthName + " " + hours + ":" + minutes;
  } else {
    const hours =
      date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return hours + ":" + minutes;
  }
}
