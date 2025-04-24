import {Outlet, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import CourseDetailsPage from './CourseDetailsPage.tsx';
import Header from "../components/common/Header.tsx";
import Footer from "../components/common/Footer.tsx";
import '../App.css';
import {QuizCreationPage} from "./QuizCreationPage.tsx";
import {AuthProvider} from "../provider/AuthProvider.tsx";
import AdminDashboard from "./admin/AdminDashboard.tsx";
import ProtectedRoute from "../routes/ProtectedRoute.tsx";
import {Role} from "@dti-isin/backend-api-client";
import {CoursesDashboard} from "./teacher/CoursesDashboard.tsx";
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
import QuizResultsPage from "./QuizResultsPage.tsx";
import QuizScreenPage from "./quiz-execution/QuizScreenPage.tsx";
import PublicationStatsPage from "./PublicationStatsPage.tsx";
import QuizReviewPage from "./QuizReviewPage.tsx";
import BadgesPage from "./BadgesPage.tsx";
import ScrollToTop from "../utils/ScrollToTop.tsx";
import QuizQuestionsPage from "./QuizQuestionsPage.tsx";

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
            <ScrollToTop/>
            <AuthProvider>
                <QuizPublicationProviders>
                    <QuizRetrieveProvider>
                        <QuizAttemptProviders>
                            <Header/>
                            <Routes>
                                <Route path="/" element={<PublicHome/>}/>

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
                                    <Route index element={<CoursesDashboard/>}/>
                                    <Route path=":courseId" element={<CourseDetailsPage/>}/>
                                    <Route
                                        path=":courseId/folders/:folderId/quizzes/:quizId/edit"
                                        element={
                                            <QuestionBankProviders>
                                                <QuestionProviders>
                                                    <QuizCreationPage/>
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
                                            <QuizReviewPage/>
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/badges"
                                    element={
                                        <ProtectedRoute allowedRoles={[Role.Student, Role.Teacher]}>
                                            <BadgesPage/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/quiz/:accessCode"
                                    element={<QuizScreenPage/>}
                                />

                                <Route path="/quiz/:accessCode/questions" element={<QuizQuestionsPage/>}/>

                                <Route
                                    path="/results/:quizAttemptId"
                                    element={<QuizResultsPage/>}
                                />
                            </Routes>
                            <Footer/>
                        </QuizAttemptProviders>
                    </QuizRetrieveProvider>
                </QuizPublicationProviders>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;