export default function Signup() {
    return (
        <div className="container">
            <h1>Inscription</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <input type="password" className="form-control" id="password" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="fname" className="form-label">Prénom</label>
                    <input type="text" className="form-control" id="fname" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="lname" className="form-label">Nom</label>
                    <input type="text" className="form-control" id="lname" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Téléphone</label>
                    <input type="tel" className="form-control" id="phone" required />
                </div>
                <button type="submit" className="btn btn-primary">S'inscrire</button>
            </form>
        </div>
    );
}