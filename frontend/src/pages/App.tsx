import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Folders from './Folders.tsx';
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import CreateFolder from "./CreateFolder.tsx";
import {FoldersProvider} from "../contexts/FoldersContext.tsx";

const App = () => {
    return (
        <div>
        <FoldersProvider>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/folders" element={<Folders />} />
                <Route path="/create-folder" element={<CreateFolder />} />
            </Routes>
            <Footer />
        </FoldersProvider>
        </div>
    );
};

export default App;
