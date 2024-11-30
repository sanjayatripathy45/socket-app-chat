import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import store, { persistor } from '@/redux-toolkit/store';
import SocketProvider from "@/context/SocketContext";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
    <SocketProvider>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </SocketProvider>
  </Provider>;
}
