import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Provider } from "react-redux";
import "./scss/app.scss";
import "./scss/_variables.scss";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./store";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ConfirmDialogProvider from "react-confirm-window";
const ConfirmDialogProviderX = ConfirmDialogProvider.defult ? ConfirmDialogProvider.default : ConfirmDialogProvider;
const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, refetchIntervalInBackground: false, refetchInterval: false, refetchOnMount: false, refetchOnReconnect: true, refetchOnWindowFocus: false, retry: false, retryOnMount: false, cacheTime: 0 } },
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <ConfirmDialogProviderX>
                    <RouterProvider router={router} />
                </ConfirmDialogProviderX>

                <ToastContainer position="top-center" autoClose={5000} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss={false} draggable={false} theme="colored" style={{ width: "550px" }} />
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </React.StrictMode>
);
