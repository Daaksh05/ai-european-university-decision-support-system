import React from "react";

export const BrandLogo = ({ className, size = 40 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#00f2fe" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Brain/Circuitry Box Outer Frame */}
            <rect x="15" y="15" width="70" height="70" rx="4" stroke="currentColor" strokeWidth="2" strokeOpacity="0.8" />

            {/* Brain Motif - Cerebral Outlines + Circuits */}
            <path
                d="M50 25C40 25 32 32 32 42C32 46 34 50 37 53C35 55 34 58 34 61C34 71 42 78 50 78"
                stroke="url(#logo-gradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
            />
            <path
                d="M50 25C60 25 68 32 68 42C68 46 66 50 63 53C65 55 66 58 66 61C66 71 58 78 50 78"
                stroke="url(#logo-gradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
            />

            {/* Circuitry Nodes/Wires */}
            <line x1="50" y1="20" x2="50" y2="83" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* Left Hem - Node Dots */}
            <circle cx="42" cy="35" r="2.5" fill="white" />
            <circle cx="38" cy="50" r="2.5" fill="white" />
            <circle cx="44" cy="65" r="2.5" fill="white" />

            {/* Right Hem - Node Dots */}
            <circle cx="58" cy="35" r="2.5" fill="white" />
            <circle cx="62" cy="50" r="2.5" fill="white" />
            <circle cx="56" cy="65" r="2.5" fill="white" />

            {/* Central Connector Lines */}
            <path d="M50 40L42 35" stroke="currentColor" strokeWidth="1" />
            <path d="M50 55L38 50" stroke="currentColor" strokeWidth="1" />
            <path d="M50 70L44 65" stroke="currentColor" strokeWidth="1" />

            <path d="M50 40L58 35" stroke="currentColor" strokeWidth="1" />
            <path d="M50 55L62 50" stroke="currentColor" strokeWidth="1" />
            <path d="M50 70L56 65" stroke="currentColor" strokeWidth="1" />
        </svg>
    );
};
