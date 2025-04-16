import Cookies from "js-cookie";

export function clearAllCookies() {
  const cookies = Cookies.get();
  Object.keys(cookies).forEach((cookieName) => {
    Cookies.remove(cookieName);
    Cookies.remove(cookieName, { path: "/" });
    Cookies.remove(cookieName, {
      path: "",
      domain: window.location.hostname,
    });
  });
}
