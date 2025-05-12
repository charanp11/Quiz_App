import "@/styles/globals.css";
import { MathJaxContext } from "better-react-mathjax";

export default function App({ Component, pageProps }) {
  const config = {
    loader: { load: ["input/asciimath", "output/chtml"] },
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
  };

  return (
    <MathJaxContext config={config}>
      <Component {...pageProps} />
    </MathJaxContext>
  );
}
