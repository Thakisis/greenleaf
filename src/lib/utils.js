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

function toCamelCase(str) {
	if (!str.includes("-")) return str; // ya está en camelCase
	const [first, ...rest] = str.split("-");
	return (
		first.toLowerCase() +
		rest.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")
	);
}

export function createObjProxy(ids, parent = document) {
	const root =
		typeof parent === "string" ? document.querySelector(parent) : parent;

	// Crear mapa de IDs normalizados (en camelCase) → ID original
	const normalizedIds = ids.map((id) => [toCamelCase(id), id]);

	// Evitar claves duplicadas por colisiones en camelCase
	const seen = new Set();
	for (const [camelKey] of normalizedIds) {
		if (seen.has(camelKey)) {
			console.warn(`ID conflict: multiple IDs normalize to '${camelKey}'`);
		}
		seen.add(camelKey);
	}

	// Buscar los nodos y asignarlos con clave en camelCase
	const refs = Object.fromEntries(
		normalizedIds.map(([camelKey, originalId]) => [
			camelKey,
			root.querySelector(`#${originalId}`),
		])
	);

	return new Proxy(refs, {
		get(target, prop) {
			if (prop === "log") {
				return () => {
					const snapshot = Object.fromEntries(
						normalizedIds.map(([camelKey]) => [camelKey, target[camelKey]])
					);
					console.log(snapshot);
				};
			}

			if (!(prop in target)) return undefined;

			const el = target[prop];

			if (el && document.contains(el)) {
				return el;
			}

			// Buscar ID original para refrescar
			const originalId = normalizedIds.find(
				([camelKey]) => camelKey === prop
			)?.[1];
			if (!originalId) return undefined;

			const refreshed = root.querySelector(`#${originalId}`);
			target[prop] = refreshed;
			return refreshed;
		},
	});
}
