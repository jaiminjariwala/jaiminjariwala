import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import './styles/animations.css';
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		// lenis for smooth scrolling
		const lenis = new Lenis({
			duration: 1.8, // longer duration for extended momentum
			easing: (t) => 1 - Math.pow(1 - t, 4), // custom easing for smooth inertia
			smoothWheel: true, // wheel smoothness
			smoothTouch: false, // disabling for touch
			wheelMultiplier: 1.3, // slightly more sensitive
			lerp: 0.08, // linear interpolation for inertia effect
		});

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Cleanup on component unmount
		return () => {
			lenis.destroy();
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