import { useContext, useEffect, useState } from "react";
import { _setAccessToken, api } from "./config/api";
import { AuthContext} from "./Components/AuthContext";
import { useNavigate } from "react-router";

export default function Login() {
  const [authCred, setAuthCred] = useState<{
    email?: string;
    password?: string;
  }>({});

  // useEffect(() => {
  //         console.log(authCred);
  //     }, [authCred]);

  

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("came of effect!");
    if (auth?.accessToken) {
      console.log("auth hai !!");
      navigate("/dashboard");
    }
  }, [auth?.accessToken]);

  async function handlesubmit(e: React.MouseEvent) {
    try {
      const res = await api.post("/signin", authCred, {withCredentials: true});
      if (res.data.accessToken) {
        auth?.setAccesToken(res.data.accessToken);
        console.log(res);
        _setAccessToken(res.data.accessToken);
       // navigate("/dashboard");
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="bg-gray-50 h-screen flex justify-center items-center">
      <div className="w-[24rem] h-[80%] rounded-md border border-neutral-200 shadow p-4 bg-white">
        <h1 className="text-5xl mb-4">Login</h1>
        <p className="text-sm mb-8">Hi, Welcome Back &#9995;</p>
        <div>
          <button className="border border-neutral-300 rounded min-w-full h-10 mb-10 flex items-center justify-center gap-2 hover:bg-neutral-100">
            <svg
              className="size-5 inline"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>{" "}
            Login with Google
          </button>

          <div className="flex items-center min-w-full mb-8">
            <div className=" grow border border-gray-200"></div>
            <span className="mx-4 text-xs shrink text-neutral-400">
              or Login with Email
            </span>
            <div className=" grow border-t border border-gray-200"></div>
          </div>

          <div className="mb-4">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => {
                setAuthCred((prev) => ({...prev, email: e.target.value  }));
              }}
              className="min-w-full mt-2 p-2 border border-neutral-300 rounded-md placeholder:text-sm focus:outline-neutral-200"
              id="email"
              type="email"
              placeholder="E.g. johndoe@email.com"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => {
                setAuthCred((prev) => ({...prev, password: e.target.value }));
              }}
              className="min-w-full mt-2 p-2 border border-neutral-300 rounded-md placeholder:text-sm focus:outline-neutral-200"
              id="password"
              type="password"
              placeholder="Enter Password"
            />
          </div>

          <button
            onClick={handlesubmit}
            className="min-w-full p-2 bg-blue-400 hover:bg-blue-600 shadow rounded-md text-neutral-200 hover:text-neutral-100">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
