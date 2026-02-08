import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import About from "../pages/About";
import AppTest from "../test/AppTest";

const MainRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/test" element={<AppTest/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoutes;
