import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Home';
import CourseDetails from './CourseDetails';
import Header from "../components/common/Header.tsx";
import Footer from "../components/common/Footer.tsx";
import { FolderProvider } from "../contexts/folder/FolderProvider.tsx";
import '../App.css';
import { CourseProvider } from "../provider/CourseProvider.tsx";
import {QuizCreation} from "./QuizCreation.tsx";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <CourseProvider>
                <FolderProvider>
                    <div>
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses/:courseId" element={<CourseDetails />} />
                            <Route path="/courses/:courseId/folders/:folderId/quizzes/:quizId/edit" element={<QuizCreation />} />
                        </Routes>
                        <Footer />
                    </div>
                </FolderProvider>
            </CourseProvider>
        </QueryClientProvider>
    );
};

export default App;