import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface QuestionNavigationArrowsProps {
    currentIndex: number;
    totalQuestions: number;
    onPrevious: () => void;
    onNext: () => void;
}

export const QuestionNavigationArrows: React.FC<QuestionNavigationArrowsProps> = ({
                                                                                      currentIndex,
                                                                                      totalQuestions,
                                                                                      onPrevious,
                                                                                      onNext
                                                                                  }) => {
    return (
        <div className="flex justify-between items-center px-6 gap-6 mt-6 mb-8">
            <button
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="btn btn-circle btn-outline btn-primary hover:scale-105 transition-all disabled:opacity-40"
                aria-label="Previous Question"
            >
                {/* Usiamo una freccia più stabile come dimensioni */}
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>

            <span className="text-md text-base-content font-semibold tracking-wide whitespace-nowrap">
                Question {currentIndex + 1} of {totalQuestions}
            </span>

            <button
                onClick={onNext}
                disabled={currentIndex >= totalQuestions - 1}
                className="btn btn-circle btn-outline btn-primary hover:scale-105 transition-all disabled:opacity-40"
                aria-label="Next Question"
            >
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </button>
        </div>
    );
};
