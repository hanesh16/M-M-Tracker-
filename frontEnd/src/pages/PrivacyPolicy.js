import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
								alt="Go to login"
								style={{ height: '100px', width: 'auto', borderRadius: '8px', display: 'block', transition: 'transform 0.2s ease' }}
							/>
						</button>

						{/* Content */}
						<h1 style={{
							color: '#2f2b28',
							fontSize: '2rem',
							fontWeight: 'bold',
							marginBottom: '20px',
							textAlign: 'center'
						}}>
							Privacy Policy
						</h1>

						<div style={{
							color: '#6b6359',
							fontSize: '1rem',
							lineHeight: '1.8',
							marginBottom: '20px'
						}}>
							<h2 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginTop: '20px',
								marginBottom: '10px'
							}}>
								1. Introduction
							</h2>
							<p>
								At M&M Tracker, we are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
							</p>

							<h2 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginTop: '20px',
								marginBottom: '10px'
							}}>
								2. Information We Collect
							</h2>
							<p>
								We collect information you provide directly to us, such as when you create an account, including your name, email address, phone number, and expense data. We also automatically collect certain information about your device and how you interact with our services.
							</p>

							<h2 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginTop: '20px',
								marginBottom: '10px'
							}}>
								3. How We Use Your Information
							</h2>
							<p>
								We use the information we collect to provide, maintain, and improve our services, process transactions, send administrative information, and respond to your inquiries. Your expense data helps us provide personalized insights and recommendations through Mocha and Milky.
							</p>

							<h2 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginTop: '20px',
								marginBottom: '10px'
							}}>
								4. Data Security
							</h2>
							<p>
								We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
							</p>

							<h2 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginTop: '20px',
								marginBottom: '10px'
							}}>
								5. Your Rights
							</h2>
							<p>
								You have the right to access, update, or delete your personal information. You can manage your account settings at any time. If you have any questions about your data, please contact us at the email addresses provided in our Help & Support section.
							</p>

							<h2 style={{
								color: '#2f2b28',
								fontSize: '1.3rem',
								fontWeight: 'bold',
								marginTop: '20px',
								marginBottom: '10px'
							}}>
								6. Contact Us
							</h2>
							<p>
								If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at milky092167@gmail.com or mocha111276@gmail.com.
							</p>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
};

export default PrivacyPolicy;
