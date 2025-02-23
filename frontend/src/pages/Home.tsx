const Home = () => {
    return (
        <div className="container-fluid bg-light min-vh-100 p-0">
            {/* Sezione Header */}
            <header className="bg-info text-white py-5">
                <div className="container">
                    <h1 className="display-4">Benvenuto alla Home!</h1>
                    <p className="lead">
                        Nome Cognome
                    </p>
                </div>
            </header>

            {/* Sezione Servizi */}
            <section className="py-5 bg-white">
                <div className="container text-center">
                    <h2 className="text-primary mb-4">I Nostri Servizi</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img src="https://via.placeholder.com/300" alt="Servizio 1" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">Servizio 1</h5>
                                    <p className="card-text">Descrizione del servizio 1.</p>
                                    <a href="#!" className="btn btn-primary">Scopri di più</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img src="https://via.placeholder.com/300" alt="Servizio 2" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">Servizio 2</h5>
                                    <p className="card-text">Descrizione del servizio 2.</p>
                                    <a href="#!" className="btn btn-primary">Scopri di più</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm">
                                <img src="https://via.placeholder.com/300" alt="Servizio 3" className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">Servizio 3</h5>
                                    <p className="card-text">Descrizione del servizio 3.</p>
                                    <a href="#!" className="btn btn-primary">Scopri di più</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sezione Testimonianze */}
            <section className="py-5 bg-info text-white">
                <div className="container text-center">
                    <h2 className="mb-4">Cosa Dicono di Noi</h2>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card bg-light shadow-sm">
                                <div className="card-body">
                                    <p className="card-text">"Ottimo servizio! Sono molto soddisfatto!"</p>
                                    <footer className="blockquote-footer">Cliente Satisfied</footer>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light shadow-sm">
                                <div className="card-body">
                                    <p className="card-text">"Un'esperienza incredibile. Lo consiglio vivamente!"</p>
                                    <footer className="blockquote-footer">Cliente Happy</footer>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light shadow-sm">
                                <div className="card-body">
                                    <p className="card-text">"La miglior piattaforma che abbia mai usato!"</p>
                                    <footer className="blockquote-footer">Cliente Enthusiast</footer>
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
