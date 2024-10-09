import {RootState, persistore, wrapper} from "@/redux/store";
import {useDispatch, useSelector} from "react-redux";
import ApiFeature from "@/Api/ApiFeature";
import ActionFeature from "@/Api/ActionFeature";
import {useEffect, useState} from "react";
import type {AppProps} from "next/app";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import FullLayout from "../components/layouts/FullLayout";
import {PersistGate} from "redux-persist/integration/react";
import {Toaster} from "react-hot-toast";
import "../styles/globals.css";
import "../styles/style.scss";
import {useRouter} from "next/router";
import {GoogleOAuthProvider} from "@react-oauth/google";

function App({Component, pageProps}: AppProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mount, setMount] = useState(false);
  const [disable, setDisable] = useState(true);
  const token = useSelector(
    (state: RootState) => state?.login?.userToken?.token
  );
  const routeChange = () => {
    router.events.on("routeChangeComplete", () => setDisable(false));
  };

  useEffect(() => {
    setMount(true);

    if (
      !token &&
      router.pathname !== "/login" &&
      router.pathname !== "/register" &&
      router.pathname !== "/"
    ) {
      // Redirect users who are not authenticated to the login page
      setDisable(true);
      router.push("/login");
    } else if (
      token &&
      (router.pathname === "/login" ||
        router.pathname === "/register" ||
        router.pathname === "/")
    ) {
      // Redirect authenticated users away from the "login" and "register" routes
      setDisable(true);
      router.push("/dashboard");
    } else {
      setDisable(false);
    }
  }, [token, router.pathname]);

  const clientId: any = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // configure ApiFeature and ActionFeature
  ApiFeature.config = {
    router: router,
    dispatch: dispatch,
    token: token || "",
  };

  ActionFeature.config = {
    dispatch: dispatch,
  };
  useEffect(() => {
    setMount(true);
  }, []);

  if (disable) {
    return null;
  } else {
    return (
      <>
        <Toaster position="top-right" />
        <GoogleOAuthProvider clientId={clientId}>
          <PersistGate loading={null} persistor={persistore}>
            {(mount && router.pathname === "/login") ||
              router.pathname === "/register" ||
              router.pathname === "/" ? (
              <Component {...pageProps} />
            ) : (
              <FullLayout>
                <Component {...pageProps} />
              </FullLayout>
            )}
          </PersistGate>
        </GoogleOAuthProvider>
      </>
    );
  }
}
export default wrapper.withRedux(App);
