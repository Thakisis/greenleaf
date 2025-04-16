import Lenis from "lenis";
import { getScrollTops, getMostVisibleElement } from "@lib/utils";
import { navigate } from "astro:transitions/client";
import { act } from "react";
function createLenis() {
	const scrollTops = getScrollTops();
	let activeSection = null;

	let scroll = 0;
	const lenis = new Lenis({
		autoRaf: true,
		duration: 1.2, // smooth scroll duration in seconds
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // optional custom easing
	});
	const getScroll = () => scroll;

	lenis.on("scroll", (e) => {
		scroll = e.scroll;
		const { mostVisible, urlMostVisible } = getMostVisibleElement(
			scrollTops,
			scroll
		);
		if (urlMostVisible !== activeSection) {
			const oldActive = document.querySelector(".activeMenu");
			const newActive = document.querySelector(
				'[href="' + urlMostVisible + '"]'
			);
			oldActive?.classList.remove("activeMenu");
			newActive?.classList.add("activeMenu");
			console.log("lasturl", urlMostVisible);
			activeSection = urlMostVisible;
			history.replaceState(null, "", urlMostVisible);
		}
	});

	function beforeSwap(event) {
		scroll = getScroll();
	}
	function afterSwap(event) {
		console.log("after swap", scroll);
	}
	function afterload(event) {
		const section = event.target.location.pathname.replaceAll("/", "");
		const elementId = document.getElementById(section);
		console.log("after swap", section);
		window.scrollTo(0, scroll);
		if (section !== "") {
			return lenis.scrollTo(elementId);
		}
		lenis.scrollTo(0);
	}
	document.addEventListener("astro:before-preparation", beforeSwap);
	document.addEventListener("astro:after-swap", afterSwap);
	document.addEventListener("astro:page-load", afterload);

	return { lenis, getScroll };
}

const { lenis } = createLenis();
/*

<script>
    import { swapUrl } from '@scripts/navigation';
    import ControlScroll from '@scripts/navigation';
    const {beforeSwap,afterSwap}=ControlScroll()
    


</script>
*/
export default lenis;
