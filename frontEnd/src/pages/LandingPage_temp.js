import React from 'react';
import { Link } from 'react-router-dom';
import Character from '../components/Character';
import SpeechBubble from '../components/SpeechBubble';

const messages = [
  'Track your daily income like salary',
  'Add daily expenses easily',
  'See how much you save',
  'View monthly summaries'
];

const LandingPage = () => {
  return (
    <>
      <section className="hero-bg" style={{ background: 'linear-gradient(135deg, #d8e9f3 0%, #f0f5f8 50%, #fdf8f1 100%)', padding: '0px 20px 20px 20px', minHeight: '100vh' }}>
        <div className="container">
          <div className="row align-items-center g-4" style={{ minHeight: '100vh' }}>
            {/* Left side - Text content */}
            <div className="col-lg-6 d-flex flex-column justify-content-center">
              <h1 className="fw-bold mb-3" style={{ color: '#2f2b28', fontSize: '2.5rem', marginTop: 0 }}>
                Daily Expense Tracker
              </h1>
              <p className="lead text-muted mb-4">
                Meet Mocha and Milky! They'll help you track every expense, manage your bills and taxes, and watch your savings grow. With gentle guidance from Mocha and Milky, easy-to-read summaries, and a clean visual design, the tracker helps you build better money habits and make smarter financial decisions every day.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/signup" className="btn mocha-btn px-4 py-2 fw-semibold">
                  Get Started
                </Link>
                <Link to="/login" className="btn login-btn px-4 py-2 fw-semibold">
                  Login
                </Link>
              </div>
            </div>

            {/* Right side - Character image */}
            <div className="col-lg-6 d-flex flex-column align-items-center justify-content-center">
              <div style={{ maxWidth: '100%', width: '100%' }}>
                <Character />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#ffffff', padding: '48px 20px' }}>
        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            <div className="col">
              <div className="card-soft rounded-4 p-4 h-100 card-hover card-one card-peach" style={{ border: 'none', boxShadow: '0 10px 26px rgba(0,0,0,0.08)', background: '#ffffff' }}>
                <div className="card-img-slot">
                  <img className="card-img-animate card-img-milky" src={require('../images/pic2.png')} alt="Milky" />
                </div>
                <h5 className="fw-semibold" style={{ color: '#f6b7a0' }}>Milky Loves to Enjoy Life</h5>
                <p className="text-muted mb-0" style={{ color: '#4a423c' }}>
                  Milky believes in enjoying the present moment. She loves spending money on good food, shopping for things she likes, and treating herself whenever she feels happy.
                </p>
              </div>
            </div>

            <div className="col">
              <div className="card-soft rounded-4 p-4 h-100 card-hover card-one card-peach" style={{ border: 'none', boxShadow: '0 10px 26px rgba(0,0,0,0.08)', background: '#ffffff' }}>
                <div className="card-img-slot">
                  <img className="card-img-animate card-img-milky" src={require('../images/pic3.png')} alt="Milky Travel" />
                </div>
                <h5 className="fw-semibold" style={{ color: '#f6b7a0' }}>Milky Loves Travel & Fun</h5>
                <p className="text-muted mb-0" style={{ color: '#4a423c' }}>
                  Milky enjoys going on trips, exploring new places, and making memories. She believes money should also be used to enjoy life and experience happiness.
                </p>
              </div>
            </div>

            <div className="col">
              <div className="card-soft rounded-4 p-4 h-100 card-hover card-one card-brown" style={{ border: 'none', boxShadow: '0 10px 26px rgba(0,0,0,0.08)', background: '#ffffff' }}>
                <div className="card-img-slot">
                  <img className="card-img-animate card-img-milky" src={require('../images/pic4.png')} alt="Mocha" />
                </div>
                <h5 className="fw-semibold" style={{ color: '#DAA06D' }}>Mocha is Disciplined & Focused</h5>
                <p className="text-muted mb-0" style={{ color: '#4a423c' }}>
                  Mocha is a hardworking and disciplined character. He carefully plans his income and expenses and believes in being responsible with money every day.
                </p>
              </div>
            </div>

            <div className="col">
              <div className="card-soft rounded-4 p-4 h-100 card-hover card-one card-brown" style={{ border: 'none', boxShadow: '0 10px 26px rgba(0,0,0,0.08)', background: '#ffffff' }}>
                <div className="card-img-slot">
                  <img className="card-img-animate card-img-milky" src={require('../images/pic5.png')} alt="Mocha Future" />
                </div>
                <h5 className="fw-semibold" style={{ color: '#DAA06D' }}>Mocha Saves for the Future</h5>
                <p className="text-muted mb-0" style={{ color: '#4a423c' }}>
                  Mocha loves saving money for future goals. He focuses on long-term stability, emergency savings, and building a secure future for both himself and Milky.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ background: '#ffffff', padding: '60px 20px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ color: '#2f2b28', fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '10px' }}>How It Works</h2>
            <p style={{ color: '#8b8078', fontSize: '1.05rem' }}>Simple steps to master your money with Mocha and Milky</p>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {/* Step 1 */}
              <div className="col">
                <div className="how-it-works-step step-1" style={{
                  background: '#fffaf3',
                  border: '2px solid #c08b5c',
                  borderRadius: '20px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  position: 'relative',
                  minHeight: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#f6b7a0',
                    color: '#ffffff',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}>1</div>
                  <h5 style={{ color: '#c08b5c', fontWeight: 'bold', marginBottom: '10px' }}>Add Your Income</h5>
                  <p style={{ color: '#6b6359', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                    Start by adding your salary or income. Mocha helps you plan and organize your earnings in a simple way.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="col">
                <div className="how-it-works-step step-2" style={{
                  background: '#fffaf3',
                  border: '2px solid #c08b5c',
                  borderRadius: '20px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  position: 'relative',
                  minHeight: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#f6b7a0',
                    color: '#ffffff',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}>2</div>
                  <h5 style={{ color: '#c08b5c', fontWeight: 'bold', marginBottom: '10px' }}>Track Daily Expenses</h5>
                  <p style={{ color: '#6b6359', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                    Milky adds daily spending like food, travel, shopping, and fun activities with ease.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="col">
                <div className="how-it-works-step step-3" style={{
                  background: '#fffaf3',
                  border: '2px solid #c08b5c',
                  borderRadius: '20px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  position: 'relative',
                  minHeight: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#f6b7a0',
                    color: '#ffffff',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}>3</div>
                  <h5 style={{ color: '#c08b5c', fontWeight: 'bold', marginBottom: '10px' }}>Watch Your Savings Grow</h5>
                  <p style={{ color: '#6b6359', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                    The system automatically calculates how much money you save after expenses.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="col">
                <div className="how-it-works-step step-4" style={{
                  background: '#fffaf3',
                  border: '2px solid #c08b5c',
                  borderRadius: '20px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                  position: 'relative',
                  minHeight: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#f6b7a0',
                    color: '#ffffff',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px'
                  }}>4</div>
                  <h5 style={{ color: '#c08b5c', fontWeight: 'bold', marginBottom: '10px' }}>Understand Monthly Summary</h5>
                  <p style={{ color: '#6b6359', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                    View clear monthly summaries that show where your money goes and how well you're saving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Balance Spending and Saving Section */}
      <section style={{ background: '#ffffff', padding: '60px 20px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ color: '#2f2b28', fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Balance Spending and Saving the Smart Way</h2>
            <p style={{ color: '#8b8078', fontSize: '1.05rem' }}>Understand how Mocha and Milky work together for your financial happiness</p>
          </div>

          <div className="row align-items-center g-5">
            {/* Milky's Side - Spending */}
            <div className="col-lg-5">
              <div className="balance-card balance-milky" style={{
                background: '#fffaf3',
                border: '2px solid #c08b5c',
                borderRadius: '20px',
                padding: '40px 30px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  height: '80px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Space reserved for Milky image */}
                </div>
                <h5 style={{ color: '#f6b7a0', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '15px' }}>Milky Enjoys Living in the Moment</h5>
                <p style={{ color: '#6b6359', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Milky loves to enjoy life — traveling, eating good food, shopping, and creating memories. She believes money should be used to feel happy and fulfilled.
                </p>
              </div>
            </div>

            {/* Center Balance Message - Flip Card */}
            <div className="col-lg-2 d-flex align-items-center justify-content-center">
              <div className="flip-card">
                <div className="flip-card-inner">
                  {/* Front - Image */}
                  <div className="flip-card-front">
                    <img src={require('../images/pic6.png')} alt="Balance" style={{
                      maxHeight: '280px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }} />
                  </div>

                  {/* Back - Message */}
                  <div className="flip-card-back">
                    <div style={{
                      background: '#f6b7a0',
                      color: '#ffffff',
                      padding: '25px 20px',
                      borderRadius: '15px',
                      boxShadow: '0 6px 20px rgba(240, 177, 160, 0.4)',
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      lineHeight: '1.6',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      Smart money management is about balance — not sacrifice.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mocha's Side - Saving */}
            <div className="col-lg-5">
              <div className="balance-card balance-mocha" style={{
                background: '#fffaf3',
                border: '2px solid #c08b5c',
                borderRadius: '20px',
                padding: '40px 30px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}>
                <div style={{
                  height: '80px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Space reserved for Mocha image */}
                </div>
                <h5 style={{ color: '#DAA06D', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '15px' }}>Mocha Plans for the Future</h5>
                <p style={{ color: '#6b6359', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Mocha is disciplined and focused. He believes in saving money, planning ahead, and building a secure future with smart financial decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
