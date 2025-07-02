// // feedback page

// export default function Feedback() {
//   return (
//     <div className="feedback-page">
//       <div className="section-divider"></div>
//       <h1>Feedback Form</h1>
//       <p>This is a placeholder for the Feedback Boxes Tangi has made</p>
//       <h1>Let Us Know</h1>
//       <p>Has there been an error? Please let us know and submit any corrections that will be needed.</p>
//     </div>
//   );   //need to create div to split page and seperate let us know from feedback form then turn tangi's html code to jsx when press send 
//         // send user back to homepage
//         // add a thank you message after submit
// }

import React, { useState } from "react";
import "../styles/App.css";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola",
  "Argentina", "Australia", "Austria", "Bangladesh", "Belgium",
  "Brazil", "Canada", "China", "France", "Germany",
  "India", "Italy", "Japan", "Mexico", "Netherlands",
  "South Africa", "United Kingdom", "United States"
  // Want to import dynamically
];

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Redirect after a delay
    setTimeout(() => {
      window.location.href = "/Global-Food-Wiki"; // Homepage
    }, 2000);
  };
// Tangi's HTML code converted to JSX
  return (
    <div className="feedback-page">
      <div className="section-divider" />

      <div className="feedback-form-container">
        <h2>Let Us Know</h2>
        <p>
          Has there been an error? Please let us know and submit any corrections
          that are needed.
        </p>
        <h1>Feedback Form</h1>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="fname">First and Last Name</label>
            <input
              type="text"
              id="fname"
              name="firstname"
              placeholder="Your name.."
              //required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your email.."
              //required
            />

            <label htmlFor="country">Country</label>
            <select id="country" name="country" required>
              {countries.map((country) => (
                <option key={country} value={country.toLowerCase()}>
                  {country}
                </option>
              ))}
            </select>

            <label htmlFor="subject">Description</label>
            <textarea
              id="subject"
              name="feedback"
              placeholder="Provide Feedback.."
              style={{ height: "150px" }}
              //required
            ></textarea>

            <button type="submit">Submit</button>
          </form>
        ) : (
          <div className="thank-you-message">
            <h3>Thank you for your feedback!</h3>
            <p>Redirecting you to the homepage...</p>
          </div>
        )}
      </div>
    </div>
  );
}
