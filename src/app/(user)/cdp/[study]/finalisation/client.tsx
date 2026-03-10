'use client';

import { StudyProgressStep } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { STUDY_STEPS } from '@/db/types';

import { updateStudyFinalStep } from './actions';

const FINAL_STEPS = [
    StudyProgressStep.Ended,
    StudyProgressStep.CompanyFactored,
    StudyProgressStep.AssigneePaid,
    StudyProgressStep.SatisfactionFormSent,
    StudyProgressStep.WarrantyExpired,
];

export function FinalisationActions({
    studyProceedingId,
    currentStep,
}: {
    studyProceedingId: string;
    currentStep: StudyProgressStep;
}) {
    const allSteps = Object.values(StudyProgressStep);
    const currentIndex = allSteps.indexOf(currentStep);
    const endedIndex = allSteps.indexOf(StudyProgressStep.Ended);

    if (currentIndex < endedIndex) {
        return (
            <p className="text-muted-foreground">
                La mission doit être terminée avant de pouvoir procéder à la finalisation.
            </p>
        );
    }

    const nextStepIndex = FINAL_STEPS.findIndex((s) => s === currentStep);
    const nextStep =
        nextStepIndex >= 0 && nextStepIndex < FINAL_STEPS.length - 1
            ? FINAL_STEPS[nextStepIndex + 1]
            : undefined;

    if (!nextStep) {
        return (
            <p className="text-green-600 font-medium">
                L&apos;étude est entièrement finalisée.
            </p>
        );
    }

    const handleAdvance = () => {
        updateStudyFinalStep(studyProceedingId, nextStep).then(() => {
            window.location.reload();
        });
    };

    return (
        <div className="flex items-center gap-4">
            <Button onClick={handleAdvance}>
                Passer à : {STUDY_STEPS[nextStep].display}
            </Button>
        </div>
    );
}
