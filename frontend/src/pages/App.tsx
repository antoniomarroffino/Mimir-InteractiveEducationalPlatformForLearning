import { Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './Home';
import CourseDetails from './CourseDetails';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FolderProvider } from "../contexts/folder/FolderProvider.tsx";
import '../App.css';
import { CourseProvider } from "../contexts/course/CourseProvider.tsx";
import {QuizProvider} from "../contexts/quiz/QuizProvider.tsx";

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <CourseProvider>
                <FolderProvider>
                    <QuizProvider>
                    <div>
                        <Header />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses/:courseId" element={<CourseDetails />} />
                        </Routes>
                        <Footer />
                    </div>
                    </QuizProvider>
                </FolderProvider>
            </CourseProvider>
        </QueryClientProvider>
    );
};

export default App;