export default function debounce(callback, timeoutMs) {
  let timeout;
  return function (event) {
    clearTimeout(timeout);
    timeout = setTimeout(callback(event), timeoutMs);
  };
}
