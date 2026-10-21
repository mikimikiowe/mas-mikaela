import { BrowserRouter, Routes, Route } from "react-router-dom";
import BaseLayout from "@pages/BaseLayout";
import Project from "@pages/Project";
import Home from "@pages/Home";
import About from "@pages/About";
import Projects from "@pages/Projects";
import Playground from "@pages/Playground";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="" element={<BaseLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="projects/:id" element={<Project />} />
                    <Route path="playground" element={<Playground />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
