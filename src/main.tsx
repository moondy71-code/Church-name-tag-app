import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register"; // ⭐ 추가

createRoot(document.getElementById("root")!).render(<App />);

// ⭐ 이 줄 추가 (맨 아래)
registerSW({ immediate: true });