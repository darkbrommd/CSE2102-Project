// src/pages/AboutUs.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import './AboutUs.css';

function AboutUs() {
  const navigate = useNavigate(); 
  return (
    <div className="about-us-page">
      <Header />
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>About Us</h1>
          <p>
            Our mission is to connect loving homes with pets in need, creating lifelong bonds.
            Together, we can give every pet the life they deserve.
          </p>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="mission-vision-section">
        <div className="content-container">
          <div className="mission">
            <h2>Our Mission</h2>
            <p>
              At HuskyAdoption, we are dedicated to rescuing homeless and abandoned animals, ensuring
              their health and happiness, and finding them the perfect forever home.
            </p>
          </div>
          <div className="vision">
            <h2>Our Vision</h2>
            <p>
              A world where every animal is loved and cared for, and no pet is left without a
              family to call their own.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <img src="/images/compassion.png" alt="Compassion" />
            <h3>Compassion</h3>
            <p>
              Every life matters. We approach each animal and human with kindness and empathy.
            </p>
          </div>
          <div className="value-card">
            <img src="/images/commitment.png" alt="Commitment" />
            <h3>Commitment</h3>
            <p>
              We are dedicated to providing the best care and ensuring successful adoptions.
            </p>
          </div>
          <div className="value-card">
            <img src="/images/hope.png" alt="Hope" />
            <h3>Hope</h3>
            <p>
              We believe in a better future for animals, one adoption at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <h3>Supeng Yu</h3>
            <p>Founder & Animal Advocate</p>
          </div>
          <div className="team-member">
            <h3>Dylan C Wojteczko</h3>
            <p>Operations Manager</p>
          </div>
          <div className="team-member">
            <h3>Shrivishnu Venkatesan</h3>
            <p>Adoption Coordinator</p>
          </div>
          <div className="team-member">
            <h3>Alper Tepebas</h3>
            <p>Adoption Advisor</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>What People Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              "HuskyAdoption changed our lives. We found our perfect furry companion, and the
              adoption process was seamless!"
            </p>
            <h4>- Sarah & Max</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "The team at HuskyAdoption truly cares about the animals. Their passion and dedication
              are unmatched."
            </p>
            <h4>- Tom R.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "Thanks to HuskyAdoption, I now have a best friend. Adopting Buddy was the best decision
              I ever made."
            </p>
            <h4>- Emily T.</h4>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Join Us in Making a Difference</h2>
        <p>
          Whether you're looking to adopt, foster, or volunteer, your support helps save lives.
        </p>
        <button onClick={() => navigate('/contact')}>Get Involved</button>
      </section>
    </div>
  );
}

export default AboutUs;