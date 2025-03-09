import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Home';
import CourseDetails from './CourseDetails';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FolderProvider } from "../contexts/folder/FolderProvider.tsx";
import '../App.css';
import { CourseProvider } from "../contexts/course/CourseProvider.tsx";
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