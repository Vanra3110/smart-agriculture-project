import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Crops from "./pages/Crops";
import Navbar from "./components/Navbar";

function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/crops" element={<Crops />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;