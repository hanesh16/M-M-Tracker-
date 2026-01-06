import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Help = () => {
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
								Help & Support
							</h1>
						</div>

						{/* Help Content */}
						<div style={{ marginBottom: '30px' }}>
							<h3 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginBottom: '12px'
							}}>
								Getting Started
							</h3>
							<p style={{
								color: '#6b6359',
								fontSize: '1rem',
								lineHeight: '1.8',
								margin: '0 0 20px 0'
							}}>
								Welcome to M&M Tracker! To get started, simply create an account by clicking the "Get Started" button on the home page. Fill in your basic information, and you'll be ready to start tracking your expenses with Mocha and Milky.
							</p>
						</div>

						<div style={{ marginBottom: '30px' }}>
							<h3 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginBottom: '12px'
							}}>
								Common Questions
							</h3>
							<div style={{ marginBottom: '15px' }}>
								<p style={{
									color: '#2f2b28',
									fontSize: '1rem',
									fontWeight: '600',
									margin: '0 0 5px 0'
								}}>
									How do I track my expenses?
								</p>
								<p style={{
									color: '#6b6359',
									fontSize: '0.95rem',
									lineHeight: '1.6',
									margin: '0 0 15px 0'
								}}>
									Once logged in, you can add expenses from your dashboard. Simply enter the amount, category, and description, and M&M Tracker will keep track of everything for you.
								</p>
							</div>

							<div style={{ marginBottom: '15px' }}>
								<p style={{
									color: '#2f2b28',
									fontSize: '1rem',
									fontWeight: '600',
									margin: '0 0 5px 0'
								}}>
									What are Mocha and Milky categories?
								</p>
								<p style={{
									color: '#6b6359',
									fontSize: '0.95rem',
									lineHeight: '1.6',
									margin: '0 0 15px 0'
								}}>
									Mocha represents disciplined spending and saving for the future, while Milky represents enjoying life and spending on experiences. You can choose your financial personality when signing up.
								</p>
							</div>

							<div style={{ marginBottom: '15px' }}>
								<p style={{
									color: '#2f2b28',
									fontSize: '1rem',
									fontWeight: '600',
									margin: '0 0 5px 0'
								}}>
									Is my financial data secure?
								</p>
								<p style={{
									color: '#6b6359',
									fontSize: '0.95rem',
									lineHeight: '1.6',
									margin: '0'
								}}>
									Yes! We take your privacy seriously. Your data is stored securely and we never share your information with third parties.
								</p>
							</div>
						</div>

						<div style={{ marginBottom: '30px' }}>
							<h3 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginBottom: '12px'
							}}>
								Need More Help?
							</h3>
							<p style={{
								color: '#6b6359',
								fontSize: '1rem',
								lineHeight: '1.8',
								margin: '0 0 14px 0'
							}}>
								If you face any issues, have questions, or want to share feedback, feel free to contact us. We are always happy to listen and improve the experience for our users.
							</p>
							<p style={{
								color: '#6b6359',
								fontSize: '1rem',
								lineHeight: '1.8',
								margin: '0 0 14px 0'
							}}>
								This project is created with care by Poori (Milky) and Hanesh (Mocha). You can reach us at:
							</p>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
								<img src={require('../images/pic15.png')} alt="Milky" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
								<a href="mailto:milky092167@gmail.com" style={{
									color: '#6b6359',
									textDecoration: 'none',
									fontSize: '1rem',
									lineHeight: '1.8',
									transition: 'all 0.2s ease',
									cursor: 'pointer'
								}}
								onMouseEnter={(e) => {
									e.target.style.color = '#c08b5c';
									e.target.style.textDecoration = 'underline';
								}}
								onMouseLeave={(e) => {
									e.target.style.color = '#6b6359';
									e.target.style.textDecoration = 'none';
								}}
								>
									milky092167@gmail.com
								</a>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<img src={require('../images/pic14.png')} alt="Mocha" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
								<a href="mailto:mocha111276@gmail.com" style={{
									color: '#6b6359',
									textDecoration: 'none',
									fontSize: '1rem',
									lineHeight: '1.8',
									transition: 'all 0.2s ease',
									cursor: 'pointer'
								}}
								onMouseEnter={(e) => {
									e.target.style.color = '#c08b5c';
									e.target.style.textDecoration = 'underline';
								}}
								onMouseLeave={(e) => {
									e.target.style.color = '#6b6359';
									e.target.style.textDecoration = 'none';
								}}
								>
									mocha111276@gmail.com
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
};

export default Help;
