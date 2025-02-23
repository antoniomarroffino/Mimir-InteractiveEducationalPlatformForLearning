import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Milestones from './Milestones';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

const App = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/milestones" element={<Milestones />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
