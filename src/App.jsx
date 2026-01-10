// import About from './components/About/About';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import './styles/animations.css';
import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';
import History from './components/History/History';
import Philosophy from './components/Philosophy/Philosophy';

function App() {
	useEffect(() => {
		// Helper function to check if the device supports touch
		const isTouchDevice = () => {
			return (('ontouchstart' in window) ||
				(navigator.maxTouchPoints > 0) ||
				(navigator.msMaxTouchPoints > 0));
		};

		// Initialize Lenis for smooth scrolling on both touch and non-touch devices
		const lenis = new Lenis({
			duration: 0.5,
			easing: (t) => 1 - Math.pow(1 - t, 4),
			smoothWheel: true,
			wheelMultiplier: 1.3,
			smoothTouch: isTouchDevice() // Enable smooth scrolling for touch devices
		});

		// Animation frame for Lenis
		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Cleanup
		return () => {
			lenis.destroy();
		};
	}, []);

	return (
		<div className="container" style={{background: 'white'}}>
			<Header />
			<main>
				<Hero />
				{/* <About /> */}
				<History />
				<Philosophy />
			</main>
		</div>
	);
}

export default App;
