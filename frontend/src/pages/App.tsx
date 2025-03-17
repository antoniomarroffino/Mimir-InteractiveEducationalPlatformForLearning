import {Outlet, Route, Routes} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
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
import StudentDashboard from "./student/StudentDashboard.tsx";
import PublicHome from "./no-logged/PublicHome.tsx";

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
                                <CourseProvider>
                                    <FolderProvider>
                                        <Outlet/>
                                    </FolderProvider>
                                </CourseProvider>
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<TeacherDashboard/>}/>
                        <Route path=":courseId" element={<CourseDetails/>}/>
                        <Route
                            path=":courseId/folders/:folderId/quizzes/:quizId/edit"
                            element={<QuizCreation/>}
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
                </Routes>
                <Footer/>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;