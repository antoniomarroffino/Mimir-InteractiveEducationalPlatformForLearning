import {Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import Home from './Home';
import CourseDetails from './CourseDetails';
import Header from "../components/common/Header.tsx";
import Footer from "../components/common/Footer.tsx";
import {FolderProvider} from "../provider/FolderProvider.tsx";
import '../App.css';
import {CourseProvider} from "../provider/CourseProvider.tsx";
import {QuizCreation} from "./QuizCreation.tsx";
import {AuthProvider} from "../provider/AuthProvider.tsx";
import AdminDashboard from "./admin/AdminDashboard.tsx";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";
import {Role} from "@dti-isin/backend-api-client";
import {TeacherDashboard} from "./teacher/TeacherDashboard.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 0,
            cacheTime: 1000 * 60 * 5,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchOnMount: true,
        }
    }
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Header/>
                <CourseProvider>
                    <FolderProvider>
                        <Routes>
                            {/* Route Pubblica */}
                            <Route path="/" element={<Home />} />

                            {/* Route Protetta Admin */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={[Role.Admin]}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route path="/teacher" element={
                                <ProtectedRoute allowedRoles={[Role.Teacher]}>
                                    <CourseProvider>
                                        <FolderProvider>
                                            <TeacherDashboard />
                                        </FolderProvider>
                                    </CourseProvider>
                                </ProtectedRoute>
                            }/>

                            <Route path="/courses/:courseId" element={<CourseDetails/>}/>
                            <Route path="/courses/:courseId/folders/:folderId/quizzes/:quizId/edit"
                                   element={<QuizCreation/>}/>
                        </Routes>
                    </FolderProvider>
                </CourseProvider>
                <Footer/>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;