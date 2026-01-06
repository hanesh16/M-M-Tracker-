import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <>
      <section style={{ background: '#fbf4f3', padding: '80px 20px', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Content Section */}
          <div style={{
            background: '#f4e2e0',
            borderRadius: '20px',
            padding: '50px 40px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            position: 'relative'
          }}>
            <button
              onClick={() => navigate(-1)}
              aria-label="Go back"
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img
                src={require('../images/pic12.png')}
                alt="Go back"
                style={{ height: '100px', width: 'auto', borderRadius: '8px', display: 'block', transition: 'transform 0.2s ease' }}
              />
            </button>
            <button
              onClick={() => navigate('/login')}
              aria-label="Go to login"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              <img
                src={require('../images/pic13.png')}
                alt="Login"
                style={{ height: '100px', width: 'auto', borderRadius: '8px', display: 'block', transition: 'transform 0.2s ease' }}
              />
            </button>
            {/* Page Heading - Inside Content Box */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ 
                color: '#2f2b28', 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                margin: '0 0 15px 0'
              }}>
                About Us
              </h1>
            </div>

            {/* Paragraph 1 - Why we created M&M Tracker */}
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              lineHeight: '1.8',
              marginBottom: '25px',
              margin: '0 0 25px 0'
            }}>
              M&M Tracker was born from a simple idea: managing money shouldn't be stressful or overwhelming. We created this app because we believe everyone deserves a calm, friendly companion to help them understand their finances without judgment or complexity.
            </p>

            {/* Paragraph 2 - The philosophy */}
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              lineHeight: '1.8',
              marginBottom: '25px',
              margin: '0 0 25px 0'
            }}>
              We introduced two characters, Mocha and Milky, to represent a balanced approach to money. Mocha believes in discipline, planning, and building a secure future. Milky loves living in the moment, enjoying good experiences, and finding happiness. Together, they show us that smart money management isn't about sacrifice—it's about balance.
            </p>

            {/* Paragraph 3 - The emotional connection */}
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              lineHeight: '1.8',
              marginBottom: '25px',
              margin: '0 0 25px 0'
            }}>
              Money decisions can feel lonely and uncertain. That's why we created M&M Tracker to feel like having understanding friends guiding you. We want to build your confidence in managing money, help you develop better habits, and make the journey feel warm and supportive, not cold and mechanical.
            </p>

            {/* Paragraph 4 - Design philosophy */}
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              lineHeight: '1.8',
              marginBottom: '25px',
              margin: '0 0 25px 0'
            }}>
              We believe that how something looks and feels matters. That's why we designed M&M Tracker with soft colors, calm spaces, and a clean interface. Every detail was thoughtfully chosen to make managing your money feel peaceful and pleasant, not like a chore.
            </p>

            {/* Paragraph 5 - Who we serve */}
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              lineHeight: '1.8',
              marginBottom: '25px',
              margin: '0 0 25px 0'
            }}>
              Whether you're a student tracking your first paychecks, a professional managing multiple expenses, or someone just starting to care about your finances, M&M Tracker is here for you. We designed it for anyone who wants to feel more in control without feeling overwhelmed.
            </p>

            {/* Paragraph 6 - Final message */}
            <p style={{
              color: '#6b6359',
              fontSize: '1rem',
              lineHeight: '1.8',
              margin: '0'
            }}>
              Thank you for choosing M&M Tracker as your financial companion. We're here to help you build a life where you spend wisely, save confidently, and enjoy every step of the journey. Because at the end of the day, money is just a tool to create the life you love.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutUs;
