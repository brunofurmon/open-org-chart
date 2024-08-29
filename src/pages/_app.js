import Head from "next/head";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Open Org Chart</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;