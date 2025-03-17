import {CourseList} from "../components/course/CourseList.tsx";
import CreateCourseForm from "../components/course/CreateCourseForm.tsx";
import {useAuth} from "../hooks/useAuth.ts";

const Home = () => {
    const {user} = useAuth();

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero Section con gradiente */}
            <div className="hero py-16 bg-gradient-to-r from-primary to-secondary">
                <div className="hero-content text-center text-neutral-content">
                    <div>
                        <h1 className="text-5xl font-bold mb-2">Benvenuto alla Home!</h1>
                        <p className="text-xl">{user?.name}</p>
                    </div>
                </div>
            </div>

            {/* Quiz Section */}
            <section className="py-16 relative">
                {/* Ombra superiore */}
                <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/10"></div>

                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-primary text-center mb-8">
                        Partecipa a un quiz
                    </h2>

                    <div className="flex justify-center">
                        <div className="card w-96 bg-primary/20 shadow-xl backdrop-blur-sm">
                            <div className="card-body items-center text-center">
                                <img
                                    src="/quiz-icon.png"
                                    alt="Quiz Icon"
                                    className="w-16 h-16 mb-4"
                                />
                                <h3 className="card-title text-white">
                                    Inserisci il codice della sessione
                                </h3>
                                <div className="join w-full mt-4">
                                    <input
                                        type="text"
                                        placeholder="Inserisci il codice"
                                        className="input input-bordered join-item flex-1"
                                    />
                                    <button className="btn btn-primary join-item">
                                        Conferma
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-16 relative">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-primary text-center mb-8">
                        I tuoi Corsi
                    </h2>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <CreateCourseForm/>
                        </div>
                    </div>
                    {/* Lista dei corsi */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <CourseList/>
                        </div>
                    </div>
                </div>
            </section>

            {/* Review Section */}
            <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Quiz review</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item}
                                 className="card bg-base-100 shadow-xl hover:scale-105 transition-transform duration-300">
                                <div className="card-body">
                                    <p className="text-base-content">"Lorem ipsum"</p>
                                    <div className="text-sm opacity-70 mt-2">Lorem ipsum</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;