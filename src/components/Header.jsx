// reusable UI header 
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/GlobalFoodWikilogo.png';
import '../styles/App.css'; // you can extract styles here

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
// This component can be imported and used in your main App component or any other page