import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TypewriterText({ phrases = [], typingSpeed = 60, deletingSpeed = 40, pauseTime = 2000 }) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    let timeout;
    const targetText = phrases[currentPhraseIndex];

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (currentText === targetText) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(targetText.slice(0, currentText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, phrases, currentPhraseIndex, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-flex items-center min-h-[1.2em]">
      <span>{currentText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[1em] ml-1 bg-brand-light"
      />
    </span>
  );
}
