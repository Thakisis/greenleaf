import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { menuslist } from "@config/menus";
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
export function getScrollTops(elements = menuslist) {
	const scrollTops = elements.map((item) => {
		const element = document.getElementById(item.url.replaceAll("/", ""));
		const hero = document.getElementById("hero");
		if (element) {
			return {
				url: item.url,
				element,
				scroll: element.offsetTop,
				height: element.offsetHeight,
				active: false,
			};
		}
		return {
			url: item.url,
			element: hero,
			scroll: 0,
			height: hero.offsetHeight,
			active: false,
		};
	});
	return scrollTops;
}
export function getMostVisibleElement(elementsData, lenisScrollY) {
	const viewportTop = lenisScrollY;
	const viewportBottom = viewportTop + window.innerHeight;

	let mostVisible = null;
	let maxVisibleHeight = 0;
	let urlMostVisible = null;

	for (const data of elementsData) {
		const { element, scroll: elementTop, height: elementHeight } = data;
		if (!element) continue;

		const elementBottom = elementTop + elementHeight;

		const visibleTop = Math.max(elementTop, viewportTop);
		const visibleBottom = Math.min(elementBottom, viewportBottom);
		const visibleHeight = Math.max(0, visibleBottom - visibleTop);

		if (visibleHeight > maxVisibleHeight) {
			maxVisibleHeight = visibleHeight;
			mostVisible = data;
			urlMostVisible = data.url;
		}
	}

	return { mostVisible, urlMostVisible };
}
