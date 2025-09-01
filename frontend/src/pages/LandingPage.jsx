import "./LandingPage.css";
import logo from "../assets/logo.png";






export default function LandingPage() {
 

const API_URL = import.meta.env.VITE_API_URL;
const handleGoogle = () => {
  window.open(`${API_URL}/auth/google`, "_self");
};


   

  return (
    <div className="landing-container">
      {/* ---------- Navbar ---------- */}
      <nav className="navbar">
        <div className="logo">
          <img className="logoname" src={logo} alt="App Logo" />
          noteIT
        </div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
           
    
      </nav>


      <section className="hero" id="hero">
        <img
          src="https://pngimg.com/uploads/sticky_note/sticky_note_PNG18964.png"
          alt="Sticky Note"
          className="hero-logo"
        />
        <h1 className="hero-title">
          The ultimate <br /> Note taking tool
        </h1>
        <p className="hero-subtitle">Create notes, fast and organized.</p>
         <p className="hero-subtitle" style={{fontSize:"30px"}}>Sign in to Add Notes..!</p>
        <button className="google-btn hero-btn" onClick={handleGoogle}>
          Sign in with Google
        </button>
      </section>

    
      <section className="section" id="about">
        <h2>About noteIT</h2>
        <p>
          noteIT helps you organize your thoughts quickly and efficiently.
          Take notes, save ideas, and stay productive wherever you are.
        </p>
      </section>

      {/* ---------- Pricing Section ---------- */}
      <section className="section" id="pricing">
        <h2>Pricing</h2>
        <p>
          Our free plan allows unlimited notes. Premium plans include extra
          features like cloud sync and priority support.
        </p>
      </section>

      
      <section className="section" id="contact">
        <h2>Contact Us</h2>
        <p>Email: support@noteit.com | Phone: +123 456 7890</p>
      </section>

      <section className="section" id="faq">
        <h2>FAQ</h2>
        <p>Q: Is noteIT free? <br />A: Yes, with optional premium features.</p>
      </section>

      
      <footer className="footer" >
        <p>&copy; {new Date().getFullYear()} noteIT. All rights reserved.</p>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
          <a href="#faq">FAQ</a>
        </div>
      </footer>
    </div>
  );
}
