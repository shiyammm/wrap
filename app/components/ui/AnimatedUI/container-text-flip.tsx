"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface ContainerTextFlipProps {
    /** Array of words to cycle through in the animation */
    words?: string[];
    /** Time in milliseconds between word transitions */
    interval?: number;
    /** Additional CSS classes to apply to the container */
    className?: string;
    /** Additional CSS classes to apply to the text */
    textClassName?: string;
    /** Duration of the transition animation in milliseconds */
    animationDuration?: number;
}

export function ContainerTextFlip({
    words = ["thoughtful", "unique", "heartfelt", "delightful"],
    interval = 2000, // Reduced for faster cycling
    className,
    textClassName,
    animationDuration = 500 // Reduced for smoother animation
}: ContainerTextFlipProps) {
    const id = useId();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [width, setWidth] = useState(100);
    const textRef = useRef<HTMLDivElement>(null);

    // Update container width based on the current word's scrollWidth
    const updateWidthForWord = () => {
        if (textRef.current) {
            const textWidth = textRef.current.scrollWidth + 10; // Reduced padding for tighter fit
            setWidth(textWidth);
        }
    };

    // Trigger width update when the word changes
    useEffect(() => {
        updateWidthForWord();
    }, [currentWordIndex]);

    // Cycle through words at the specified interval
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        }, interval);

        return () => clearInterval(intervalId);
    }, [words, interval]);

    return (
        <motion.div
            layout
            layoutId={`words-here-${id}`}
            animate={{ width }}
            transition={{
                duration: animationDuration / 2000,
                ease: "easeInOut"
            }}
            className={cn(
                "relative inline-block rounded-lg pt-2 pb-3 text-center",
                className
            )}
            key={words[currentWordIndex]}
        >
            <motion.span
                transition={{
                    duration: animationDuration / 1000,
                    ease: "easeInOut"
                }}
                className={cn("inline-block", textClassName)}
                ref={textRef}
                layoutId={`word-div-${words[currentWordIndex]}-${id}`}
            >
                <motion.span className="inline-block">
                    {words[currentWordIndex].split("").map((letter, index) => (
                        <motion.span
                            key={index}
                            initial={{
                                opacity: 0,
                                filter: "blur(10px)"
                            }}
                            animate={{
                                opacity: 1,
                                filter: "blur(0px)"
                            }}
                            transition={{
                                delay: index * 0.02,
                                duration: animationDuration / 1000
                            }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.span>
            </motion.span>
        </motion.div>
    );
}
