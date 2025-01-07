import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import './styles/animations.css';
import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react';

function App() {
	useEffect(() => {
		const lenis = new Lenis({
		  duration: 0.5,
		  easing: (t) => 1 - Math.pow(1 - t, 4), // Smooth easing
		  smoothWheel: true,
		  smoothTouch: true,  // Enable touch scrolling
		  touchMultiplier: 2, // Adjust touch sensitivity
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