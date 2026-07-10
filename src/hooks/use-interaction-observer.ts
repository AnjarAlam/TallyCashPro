'use client';
import { RefObject, useEffect, useState } from "react";

export function useIntersectionObserver(
    elementRef: RefObject<Element>,
    options: IntersectionObserverInit = {}
): IntersectionObserverEntry | undefined {
    const [entry, setEntry] = useState<IntersectionObserverEntry>();

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setEntry(entry);
        }, options);

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [elementRef, options]);

    return entry;
}