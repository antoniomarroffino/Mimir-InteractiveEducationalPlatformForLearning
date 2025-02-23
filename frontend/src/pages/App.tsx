import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Milestones from './Milestones';
import Header from "../components/Header.tsx";

const App = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/milestones" element={<Milestones />} />
            </Routes>
        </div>
    );
};

export default App;
