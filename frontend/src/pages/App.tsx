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
import {AdminProvider} from "../provider/AdminProvider.tsx";
import UserProfile from "../components/user/UserProfile.tsx";
import {QuizStatsPage} from "./QuizStatsPage.tsx";
import {QuizRetrieveProvider} from '../provider/QuizRetrieveProvider.tsx';
import {QuizPublicationProviders} from "../provider/quizPublication/QuizPublicationProviders.tsx";
import {QuizAccessRoute} from "../components/common/QuizAccessRoute.tsx";
import {CourseProviders} from "../provider/course/CourseProviders.tsx";
import {FolderProviders} from "../provider/folder/FolderProviders.tsx";
import {QuizProviders} from "../provider/quiz/QuizProviders.tsx";
import {QuestionProviders} from "../provider/question/QuestionProviders.tsx";
import {QuizAttemptProviders} from "../provider/quizAttempt/QuizAttemptProviders.tsx";
import {QuizAttemptLocalProvider} from "../provider/quizAttempt/QuizAttemptLocalProvider.tsx";
import QuizResults from "./QuizResults.tsx";

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
                        <QuizAttemptProviders>
                            <QuizAttemptLocalProvider>
                                <Header/>
                                <Routes>
                                    {/* Public Route */}
                                    <Route path="/" element={<PublicHome/>}/>

                                    {/* Admin Routes */}
                                    <Route
                                        path="/admin"
                                        element={
                                            <ProtectedRoute allowedRoles={[Role.Admin]}>
                                                <AdminProvider>
                                                    <AdminDashboard/>
                                                </AdminProvider>
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
                                                        <QuizProviders>
                                                            <Outlet/>
                                                        </QuizProviders>
                                                    </FolderProviders>
                                                </CourseProviders>
                                            </ProtectedRoute>
                                        }
                                    >
                                        <Route index element={<TeacherDashboard/>}/>
                                        <Route path=":courseId" element={<CourseDetails/>}/>
                                        <Route
                                            path=":courseId/folders/:folderId/quizzes/:quizId/edit"
                                            element={
                                                <QuestionProviders>
                                                    <QuizCreation/>
                                                </QuestionProviders>
                                            }
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

                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute allowedRoles={[Role.Admin, Role.Student, Role.Teacher]}>
                                                <UserProfile/>
                                            </ProtectedRoute>
                                        }
                                    />
                                    {/* Quiz Screen Route */}
                                    <Route
                                        path="/quiz/:accessCode"
                                        element={<QuizAccessRoute/>}
                                    />
                                    <Route
                                        path="/quiz/results"
                                        element={<QuizResults/>}
                                    />
                                </Routes>
                                <Footer/>
                            </QuizAttemptLocalProvider>
                        </QuizAttemptProviders>
                    </QuizRetrieveProvider>
                </QuizPublicationProviders>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;