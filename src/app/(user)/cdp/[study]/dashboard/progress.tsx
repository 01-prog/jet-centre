'use client';

import { StudyProgressStep } from '@prisma/client';

import { STUDY_STEPS } from '@/db/types';

const STEP_ORDER = Object.values(StudyProgressStep);

export function StudyProgressTracker({ currentStep }: { currentStep: StudyProgressStep }) {
    const currentIndex = STEP_ORDER.indexOf(currentStep);

    return (
        <div className="flex flex-col gap-2">
            {STEP_ORDER.map((step, index) => {
                const isPast = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <div key={step} className="flex items-center gap-3">
                        <div
                            className={`w-3 h-3 rounded-full shrink-0 ${
                                isPast
                                    ? 'bg-green-500'
                                    : isCurrent
                                      ? 'bg-blue-500 ring-2 ring-blue-300'
                                      : 'bg-muted'
                            }`}
                        />
                        <span
                            className={`text-sm ${
                                isPast
                                    ? 'text-muted-foreground line-through'
                                    : isCurrent
                                      ? 'font-medium'
                                      : 'text-muted-foreground'
                            }`}
                        >
                            {STUDY_STEPS[step].display}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
