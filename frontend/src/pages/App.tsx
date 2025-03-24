import {Outlet, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import CourseDetails from './CourseDetails';
import Header from "../components/common/Header.tsx";
import Footer from "../components/common/Footer.tsx";
import '../App.css';
import {QuizCreation} from "./QuizCreation.tsx";
import {AuthProvider} from "../provider/AuthProvider.tsx";
import AdminDashboard from "./admin/AdminDashboard.tsx";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";
import {Role} from "@dti-isin/backend-api-client";
import {TeacherDashboard} from "./teacher/TeacherDashboard.tsx";
import StudentDashboard from "./student/StudentDashboard.tsx";
import PublicHome from "./no-logged/PublicHome.tsx";
import {QuizStatsPage} from "./QuizStatsPage.tsx";
import {QuizRetrieveProvider} from '../provider/QuizRetrieveProvider.tsx';
import {QuizPublicationProviders} from "../contexts/quizPublication/QuizPublicationProviders.tsx";
import {QuizAccessRoute} from "../components/common/QuizAccessRoute.tsx";
import {CourseProviders} from "../contexts/course/CourseProviders.tsx";
import {FolderProviders} from "../contexts/folder/FolderProviders.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
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
                <QuizPublicationProviders>
                    <QuizRetrieveProvider>
                        <Header/>
                        <Routes>
                            {/* Public Route */}
                            <Route path="/" element={<PublicHome/>}/>

                            {/* Admin Routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={[Role.Admin]}>
                                        <AdminDashboard/>
                                    </ProtectedRoute>
                                }
                            />

                            {/* Teacher Routes */}
                            <Route
                                path="/courses"
                                element={
                                    <ProtectedRoute allowedRoles={[Role.Teacher]}>
                                        <CourseProviders>
                                            <FolderProviders>
                                                <Outlet/>
                                            </FolderProviders>
                                        </CourseProviders>
                                    </ProtectedRoute>
                                }
                            >
                                <Route index element={<TeacherDashboard/>}/>
                                <Route path=":courseId" element={<CourseDetails/>}/>
                                <Route
                                    path=":courseId/folders/:folderId/quizzes/:quizId/edit"
                                    element={<QuizCreation/>}
                                />
                                <Route
                                    path=":courseId/publications/:publicationId/stats"
                                    element={<QuizStatsPage/>}
                                />
                            </Route>

                            {/* Student Routes */}
                            <Route
                                path="/student"
                                element={
                                    <ProtectedRoute allowedRoles={[Role.Student]}>
                                        <StudentDashboard/>
                                    </ProtectedRoute>
                                }
                            />

                            {/* Quiz Screen Route */}
                            <Route
                                path="/quiz/:accessCode"
                                element={<QuizAccessRoute/>}
                            />
                        </Routes>
                        <Footer/>
                    </QuizRetrieveProvider>
                </QuizPublicationProviders>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;