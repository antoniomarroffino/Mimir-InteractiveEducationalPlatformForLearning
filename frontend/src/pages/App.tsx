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
import {QuizPublicationPage} from "./QuizPublicationPage.tsx";
import {QuizRetrieveProvider} from '../provider/QuizRetrieveProvider.tsx';
import {QuizPublicationProviders} from "../provider/quizPublication/QuizPublicationProviders.tsx";
import {CourseProviders} from "../provider/course/CourseProviders.tsx";
import {FolderProviders} from "../provider/folder/FolderProviders.tsx";
import {QuizProviders} from "../provider/quiz/QuizProviders.tsx";
import {QuestionProviders} from "../provider/question/QuestionProviders.tsx";
import {QuestionBankProviders} from "../provider/questionBank/QuestionBankProviders.tsx";
import {QuestionBankDashboard} from "./teacher/QuestionBankDashboard.tsx";
import QuestionBankDetails from "../components/questionBank/QuestionBankDetails.tsx";
import {QuizAttemptProviders} from "../provider/quizAttempt/QuizAttemptProviders.tsx";
import {QuizAttemptLocalProvider} from "../provider/quizAttempt/QuizAttemptLocalProvider.tsx";
import QuizResults from "./QuizResults.tsx";
import QuizScreen from "./QuizScreen.tsx";
import PublicationStatsPage from "./PublicationStatsPage.tsx";
import QuizReviewPage from "./QuizReviewPage.tsx";

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
                                                <QuestionBankProviders>
                                                <QuestionProviders>
                                                    <QuizCreation/>
                                                </QuestionProviders>
                                                </QuestionBankProviders>
                                            }
                                        />
                                        <Route
                                            path=":courseId/folders/:folderId/quizzes/:quizId/publications/:publicationId"
                                            element={<QuizPublicationPage/>}
                                        />
                                        <Route
                                            path=":courseId/folders/:folderId/quizzes/:quizId/results"
                                            element={<PublicationStatsPage/>}
                                        />
                                    </Route>

                                    <Route
                                        path="/question_banks"
                                        element={
                                            <ProtectedRoute allowedRoles={[Role.Teacher]}>
                                                <QuestionBankProviders>
                                                    <QuestionProviders>
                                                        <Outlet/>
                                                    </QuestionProviders>
                                                </QuestionBankProviders>
                                            </ProtectedRoute>
                                        }
                                    >
                                        <Route index element={<QuestionBankDashboard/>}/>
                                        <Route path=":questionBankId" element={<QuestionBankDetails/>}/>

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

                                    <Route
                                        path="/quiz-review"
                                        element={
                                            <ProtectedRoute allowedRoles={[Role.Student, Role.Teacher]}>
                                                <QuizReviewPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    {/* Quiz Screen Route */}
                                    <Route
                                        path="/quiz/:accessCode"
                                        element={<QuizScreen/>}
                                    />
                                    <Route
                                        path="/results/:quizAttemptId"
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