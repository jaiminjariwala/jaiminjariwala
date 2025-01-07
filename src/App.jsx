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
			return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		};

		let lenis;
		if (!isTouchDevice()) {
			lenis = new Lenis({
				duration: 0.5,
				easing: (t) => 1 - Math.pow(1 - t, 4), // Smooth easing
				smoothWheel: true,
				smoothTouch: false,
				wheelMultiplier: 1.15,
			});

			function raf(time) {
				lenis.raf(time);
				requestAnimationFrame(raf);
			}

			requestAnimationFrame(raf);
		}

		// Cleanup
		return () => {
			if (lenis) lenis.destroy();
		};
	}, []);

	return (
		<div className="container">
			<Header />
			<main>
				<Hero />
				<About />
				<Contact />
			</main>
		</div>
	);
}

export default App;