import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultProfilePicture from "../../assets/default-profile-picture.webp";



function Auth({ user, setUser }) {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(-1);

  const autoLogin = useCallback(
    async function () {
    
        const response = await fetch("/api/user/login", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          setUser(await response.json());
        }
    },
    [setUser]
  );

  useEffect(() => {
    if (!user) {
      autoLogin();
    }
  }, [user, autoLogin]);

  async function handleLogin() {
    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput,
        password: passwordInput,
      }),
    });

    if (response.ok) {
      setIsSuccess(1);
      const user = await response.json();
      setUser(user);
      setTimeout(() => {
        setIsSuccess(-1);
        setIsLogin(true);
        setIsShowingModal(false);
      }, 1000);
    } else {
      setIsSuccess(0);
      setTimeout(() => {
        setIsSuccess(-1);
      }, 1000);
    }
  }

  async function handleSignup() {
    const response = await fetch("/api/user/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
      }),
    });

    if (response.ok) {
      setIsSuccess(1);
      const user = await response.json();
      localStorage.setItem(
        "auth",
        `${usernameInput}|${passwordInput}|${user.image}`
      );
      setUser(user);
      setTimeout(() => {
        setIsSuccess(-1);
        setIsLogin(true);
        setIsShowingModal(false);
      }, 1000);
    } else {
      setIsSuccess(0);
      setTimeout(() => {
        setIsSuccess(-1);
      }, 1000);
    }
  }

  return (
    <div className="Auth">
      {user ? (
        <Link className="router" to={`/profile/${user.username}`}>
          <p className="user-name">{user.username}</p>
          <img
            className="user-img"
            src={user.image == "default" ? defaultProfilePicture : user.image}
          />
        </Link>
      ) : (
        <>
          <p
            className="auth-btn"
            onClick={() => {
              setIsShowingModal(!isShowingModal);
            }}
          >
            Login
          </p>
          {isShowingModal && (
            <div
              className={`auth-modal ${
                isSuccess === -1 ? "" : isSuccess == 1 ? "success" : "fail"
              }`}
            >
              {isLogin ? (
                <>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Username"
                    value={usernameInput}
                    onInput={(e) => {
                      setUsernameInput(e.target.value);
                    }}
                  />
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onInput={(e) => {
                      setPasswordInput(e.target.value);
                    }}
                  />
                  <input
                    className="auth-button"
                    type="button"
                    value="Login"
                    onClick={handleLogin}
                  />
                  <br />
                  <p
                    className="auth-switcher"
                    onClick={() => {
                      setIsLogin(false);
                    }}
                  >
                    Sign up
                  </p>
                </>
              ) : (
                <>
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                    }}
                  />
                  <input
                    className="auth-input"
                    type="text"
                    placeholder="Username"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                    }}
                  />
                  <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                    }}
                  />
                  <input
                    className="auth-button"
                    type="button"
                    value="Sign up"
                    onClick={handleSignup}
                  />
                  <br />
                  <p
                    className="auth-switcher"
                    onClick={() => {
                      setIsLogin(true);
                    }}
                  >
                    Login
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Auth;
