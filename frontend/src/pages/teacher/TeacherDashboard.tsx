import CreateCourseForm from "../../components/course/CreateCourseForm.tsx";
import {CourseList} from "../../components/course/CourseList.tsx";

export const TeacherDashboard = () => {
    return (
        <section className="py-8 relative">
            <div className="container mx-auto px-4">
                {/* Titolo Sezione */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-2">
                        I tuoi Corsi
                    </h2>
                    <p className="text-base-content/70">
                        Gestisci i contenuti didattici e crea nuovi corsi
                    </p>
                </div>

                {/* Card Creazione Corso */}
                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-4">Nuovo Corso</h3>
                        <CreateCourseForm />
                    </div>
                </div>

                {/* Lista Corsi */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h3 className="card-title text-lg mb-6">Corsi Creati</h3>
                        <CourseList />
                    </div>
                </div>
            </div>
        </section>
    );
};