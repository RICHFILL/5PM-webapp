import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </Router>
  );
}

export default App;
