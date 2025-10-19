import { Toaster } from "react-hot-toast";

import { MainPage } from "@pages/MainPage/MainPage";

export const App = () => {
  return (
    <>
      <MainPage />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
};
