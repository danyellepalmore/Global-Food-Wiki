// reusable UI header contains the logo and a link to the feedback page
import { Link } from 'react-router-dom';
import logo from '../assets/GlobalFoodWikilogo.png';
import '../styles/App.css';

export default function Header() {
  return (
    <header className="app-header">
      <img
        src={logo}
        alt="Global Food Wiki logo"
        className="logo"
      />
      <Link to="/feedback" className="feedback-link">Provide Feedback</Link>
    </header>
  );
}
// This component is imported and used in main or any other page