const Home = () => {
    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            <header className="bg-info-custom text-white py-5">
                <div className="container">
                    <h1 className="display-4">Benvenuto alla Home!</h1>
                    <p className="lead">
                        Nome Cognome
                    </p>
                </div>
            </header>

            <section className="text-white py-5 shadow-up">
                <div className="container text-center">
                    <h2 className="text-primary mb-4">Partecipa a un quiz</h2>
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <div className="card shadow-sm bg-primary bg-opacity-50">
                                <div className="card-body">
                                    <img className="custom-icon" src="/quiz-icon.png" alt="Quiz Icon"/>
                                    <h5 className="card-title text-white">Inserisci il codice della sessione</h5>
                                    <div className="d-flex gap-2">
                                        <input type="text" className="form-control" placeholder="Inserisci il codice"/>
                                        <button className="btn btn-primary">
                                            Conferma
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            <section className="py-5 bg-info-custom text-white">
                <div className="container text-center">
                    <h2 className="mb-4">Quiz review</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card bg-light shadow-sm">
                                <div className="card-body">
                                    <p className="card-text">"Lorem ipsum"</p>
                                    <footer className="blockquote-footer">Lorem ipsum</footer>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light shadow-sm">
                                <div className="card-body">
                                    <p className="card-text">"Lorem ipsum"</p>
                                    <footer className="blockquote-footer">Lorem ipsum</footer>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light shadow-sm">
                                <div className="card-body">
                                    <p className="card-text">"Lorem ipsum"</p>
                                    <footer className="blockquote-footer">Lorem ipsum</footer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
