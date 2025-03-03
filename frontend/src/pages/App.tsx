import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Home';
import Folders from './Folders';
import Header from "../components/Header";
import Footer from "../components/Footer";
import CreateFolder from "./CreateFolder";
import { FolderProvider } from "../contexts/FoldersContext";
import '../App.css';


const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <FolderProvider>
                <div>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/folders" element={<Folders />} />
                        <Route path="/create-folder" element={<CreateFolder />} />
                    </Routes>
                    <Footer />
                </div>
            </FolderProvider>
        </QueryClientProvider>
    );
};

export default App;