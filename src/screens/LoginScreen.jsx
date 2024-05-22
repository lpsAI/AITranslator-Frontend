import { useState } from "react";
import LandingIntro from "../components/LandingIntro/LandingIntro";
import InputText from "../components/InputText/InputText";
import ErrorText from "../components/ErrorText/ErrorText";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    email: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const [toLogin, setToLogin] = useState(true);

  const { signUp, signIn } = useAuth();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (loginObj.email.trim() === "")
      return setErrorMessage("Email Address is required!");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    else {
      if (toLogin) {
        const { data, error } = await signIn({
          email: loginObj.email,
          password: loginObj.password,
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.info(`User ${data.user.email} is logged in`);
          location.href = "/";
        }
      } else {
        const { error } = await signUp({
          email: loginObj.email,
          password: loginObj.password,
        });

        if (error) {
          toast.error(error.message);
        } else {
          toast.info(`Check your email for the login link ${loginObj.email}`);
          setLoginObj({
            email: "",
            password: "",
          });
          setToLogin((prev) => !prev);
        }
      }
      // setLoading(true)
      // localStorage.setItem("token", "DumyTokenHere")
      // setLoading(false)
      // window.location.href = '/app/welcome'
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  const handleSwitch = () => {
    setToLogin((prev) => !prev);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="mx-auto my-auto w-full max-w-5xl sm:shadow-xl rounded-xl">
        <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
          <div className="max-sm:hidden md:block">
            <LandingIntro />
          </div>
          {toLogin && (
            <div className="py-6 md:py-24 px-4 md:px-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">
                Login
              </h2>
              <form onSubmit={(e) => submitForm(e)}>
                <div className="mb-4 mr-5 ml-5">
                  <InputText
                    type="email"
                    defaultValue={loginObj.email}
                    updateType="email"
                    containerStyle="mt-4"
                    labelTitle="Email Address"
                    updateFormValue={updateFormValue}
                  />

                  <InputText
                    defaultValue={loginObj.password}
                    type="password"
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                  />
                </div>
                <div className="text-right text-primary">
                  <span className="text-sm mr-6 inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </div>
                <ErrorText styleClass="mt-6 md:mt-8">{errorMessage}</ErrorText>
                <button
                  type="submit"
                  className={
                    "btn mt-2 max-w-md w-full we-l mx-auto block btn-primary"
                  }
                >
                  {loading ? (
                    <span className="loading loading-dots loading-md"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
              <div className="text-center mt-4">
                Don{"'"}t have an account yet?{" "}
                <span
                  onClick={() => setToLogin((prev) => !prev)}
                  className=" font-bold inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200"
                >
                  Register
                </span>
              </div>
              <div className="flex flex-wrap justify-center join">
                <button
                  className="btn join-item sm:hidden m-1"
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  About
                </button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <div className="hero min-h-full rounded-l-xl ">
                      <div className="hero-content py-2">
                        <div className="max-w-md">
                          {/* <div className="text-center mt-12"><img src="./intro.png" className="w-52 inline-block"></img></div> */}
                          <div className="text-center mt-0">
                            <img
                              src="./lps.png"
                              className="object-contain"
                            ></img>
                          </div>

                          {/* Importing pointers component */}
                          <h1 className="text-2xl mt-8 font-bold">
                            LPS Translator
                          </h1>
                          <div className="py-2">
                            <p>
                              LPS Translator is an innovative communication tool
                              designed to facilitate seamless multilingual
                              interactions in online meetings. With its
                              cutting-edge features, LPS Translator empowers
                              users to transcend language barriers and engage in
                              fluent communication regardless of their native
                              tongues.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </dialog>
                <button
                  className="btn join-item sm:hidden m-1"
                  onClick={() =>
                    document.getElementById("features_modal").showModal()
                  }
                >
                  Features
                </button>
                <dialog id="features_modal" className="modal">
                  <div className="modal-box p-0">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <div
                      id="key_features"
                      className="mx-auto w-full max-w-5xl flex flex-col justify-center rounded-box"
                    >
                      <h1 className="text-center py-4 text-xl">
                        <b>Key Features:</b>
                      </h1>
                      <div className="flex-row items-center mx-2 my-4 flex-grow-3 gap-3">
                        <div className="grid grid-cols-2 my-4">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-14 h-14 text-center m-auto stroke-primary border-red-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                              />
                            </svg>
                            <h1 className="text-center font-bold">
                              Speech to Text
                            </h1>
                          </div>
                          <div>
                            <p className="text-center text-sm mr-3">
                              LPS Translator harnesses advanced speech
                              recognition technology to accurately transcribe
                              spoken words into written text in real time. This
                              feature ensures that every utterance is swiftly
                              converted into comprehensible text, laying the
                              foundation for effective communication.
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 my-4">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-14 h-14 m-auto stroke-primary"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                              />
                            </svg>

                            <h1 className="text-center font-bold">
                              Real-time Translation
                            </h1>
                          </div>
                          <div>
                            <p className="text-center text-sm mr-3">
                              Leveraging sophisticated translation algorithms,
                              LPS Translator offers instantaneous translation of
                              the transcribed text into multiple languages.
                              Whether participants speak English, Spanish,
                              Mandarin, or any other language, LPS Translator
                              ensures that everyone receives live captions in
                              their preferred language, fostering inclusivity
                              and understanding.
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 my-4">
                          <div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-14 h-14 m-auto stroke-primary"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                            </svg>

                            <h1 className="text-center font-bold">
                              Image to Text Integration
                            </h1>
                          </div>
                          <div>
                            <p className="text-center text-sm mr-3">
                              Complementing its speech-to-text capabilities, LPS
                              Translator integrates image-to-text functionality,
                              enabling users to extract textual information from
                              images shared during online meetings. This feature
                              enhances communication by providing additional
                              context and clarity, especially when visual
                              content is involved.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </dialog>
                <button
                  className="btn join-item sm:hidden m-1"
                  onClick={() =>
                    document.getElementById("purpose_modal").showModal()
                  }
                >
                  Purpose
                </button>
                <dialog id="purpose_modal" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>
                    <div className="hero min-h-full rounded-l-xl ">
                      <div className="hero-content py-0 px-0">
                        <div className="max-w-md">
                          {/* <div className="text-center mt-12"><img src="./intro.png" className="w-52 inline-block"></img></div> */}
                          <div
                            id="purpose"
                            className="mx-auto my-3 w-full max-w-5xl  flex flex-col justify-center rounded-box"
                          >
                            <p className="text-2xl my-3">
                              <b>Purpose</b>
                            </p>
                            <span>
                              {" "}
                              The primary objective of LPS Translator is to
                              facilitate effective communication in online
                              meetings by bridging linguistic divides. By
                              enabling speakers to express themselves in their
                              native language and providing listeners with
                              real-time translations in their preferred
                              language, LPS Translator promotes inclusivity,
                              comprehension, and collaboration. Whether
                              conducting international business negotiations,
                              hosting virtual conferences, or collaborating
                              across global teams, LPS Translator empowers users
                              to communicate with confidence and clarity,
                              unlocking new opportunities for cross-cultural
                              exchange and cooperation.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          )}
          {!toLogin && (
            <div className="py-24 px-10 bg-purple-300">
              <h2 className="text-2xl font-semibold mb-2 text-center">
                Register
              </h2>
              <form onSubmit={(e) => submitForm(e)}>
                <div className="mb-4">
                  <InputText
                    type="email"
                    defaultValue={loginObj.email}
                    updateType="email"
                    containerStyle="mt-4"
                    labelTitle="Email Address"
                    updateFormValue={updateFormValue}
                  />

                  <InputText
                    defaultValue={loginObj.password}
                    type="password"
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                  />
                </div>

                <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                  {loading ? (
                    <span className="loading loading-dots loading-md"></span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
              <div className="text-center mt-4">
                <span
                  onClick={() => handleSwitch()}
                  className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200"
                >
                  Go to Login
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        id="key_features"
        className="mx-auto max-sm:hidden my-3 w-full max-w-5xl p-4 flex flex-col justify-center shadow-xl rounded-box"
      >
        <h1 className="text-center py-4 text-xl">
          <b>Key Features:</b>
        </h1>
        <div className="flex flex-row items-center mx-2 my-4 flex-grow-3 gap-3">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-14 h-14 text-center m-auto stroke-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
              />
            </svg>

            <h1 className="text-center font-bold">Speech to Text</h1>
            <p className="text-center">
              LPS Translator harnesses advanced speech recognition technology to
              accurately transcribe spoken words into written text in real time.
              This feature ensures that every utterance is swiftly converted
              into comprehensible text, laying the foundation for effective
              communication.
            </p>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-14 h-14 m-auto stroke-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
              />
            </svg>

            <h1 className="text-center font-bold">Real-time Translation</h1>
            <p className="text-center">
              Leveraging sophisticated translation algorithms, LPS Translator
              offers instantaneous translation of the transcribed text into
              multiple languages. Whether participants speak English, Spanish,
              Mandarin, or any other language, LPS Translator ensures that
              everyone receives live captions in their preferred language,
              fostering inclusivity and understanding.
            </p>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-14 h-14 m-auto stroke-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>

            <h1 className="text-center font-bold">Image to Text Integration</h1>
            <p className="text-center">
              Complementing its speech-to-text capabilities, LPS Translator
              integrates image-to-text functionality, enabling users to extract
              textual information from images shared during online meetings.
              This feature enhances communication by providing additional
              context and clarity, especially when visual content is involved.
            </p>
          </div>
        </div>
      </div>

      <div
        id="purpose"
        className="mx-auto max-sm:hidden my-3 w-full max-w-5xl p-8 bg-primary flex flex-col justify-center shadow-xl rounded-box"
      >
        <p className="text-2xl my-4 text-white">
          <b>Purpose</b>
        </p>
        <span className="text-white">
          {" "}
          The primary objective of LPS Translator is to facilitate effective
          communication in online meetings by bridging linguistic divides. By
          enabling speakers to express themselves in their native language and
          providing listeners with real-time translations in their preferred
          language, LPS Translator promotes inclusivity, comprehension, and
          collaboration. Whether conducting international business negotiations,
          hosting virtual conferences, or collaborating across global teams, LPS
          Translator empowers users to communicate with confidence and clarity,
          unlocking new opportunities for cross-cultural exchange and
          cooperation.
        </span>
      </div>
    </div>
  );
};

export default LoginScreen;
