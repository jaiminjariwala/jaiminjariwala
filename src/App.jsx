import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import './styles/animations.css';
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		// Helper function to check if the device supports touch
		const isTouchDevice = () => {
			return (('ontouchstart' in window) ||
				(navigator.maxTouchPoints > 0) ||
				(navigator.msMaxTouchPoints > 0));
		};

		// Only initialize Lenis for non-touch devices
		if (!isTouchDevice()) {
			const lenis = new Lenis({
				duration: 0.5,
				easing: (t) => 1 - Math.pow(1 - t, 4),
				smoothWheel: true,
				wheelMultiplier: 1.15,
			});

			function raf(time) {
				lenis.raf(time);
				requestAnimationFrame(raf);
			}

			requestAnimationFrame(raf);

			// Cleanup
			return () => {
				lenis.destroy();
			};
		}
	}, []);

	return (
		<div className="container" style={{ height: '100%' }}>
			<Header />
			<main style={{
				minHeight: '100vh',
				overflowY: 'auto',
				WebkitOverflowScrolling: 'touch' // Enable momentum scrolling on iOS
			}}>
				<Hero />
				<About />
				<Contact />
			</main>
		</div>
	);
}

export default App;