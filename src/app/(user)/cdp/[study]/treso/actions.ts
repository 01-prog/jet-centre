'use server';

import prisma from '@/db';

export async function getStudyTreasury(studyCode: string) {
    try {
        const studyInfos = await prisma.studyInfos.findUnique({
            where: { code: studyCode },
            include: {
                study: {
                    include: {
                        studyProceedings: {
                            include: {
                                phases: {
                                    include: { deliverable: true },
                                },
                            },
                        },
                        studyAssignees: {
                            where: { taken: true },
                            include: {
                                assignee: {
                                    include: {
                                        person: {
                                            select: { firstName: true, lastName: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!studyInfos?.study) return undefined;

        const phases = studyInfos.study.studyProceedings?.phases ?? [];
        const totalJEH = phases.reduce((sum, p) => sum + p.jehs, 0);
        const totalHT = phases.reduce((sum, p) => sum + p.jehs * p.unitPrice, 0);
        const applicationFeeRate = studyInfos.applicationFee / 100;
        const totalWithFees = totalHT * (1 + applicationFeeRate);

        return {
            studyCode: studyInfos.code,
            title: studyInfos.title,
            applicationFee: studyInfos.applicationFee,
            cc: studyInfos.cc,
            currentStep: studyInfos.study.studyProceedings?.studyProcessStep,
            phases,
            assignees: studyInfos.study.studyAssignees,
            summary: {
                totalJEH,
                totalHT,
                totalWithFees,
                averageUnitPrice: totalJEH > 0 ? totalHT / totalJEH : 0,
            },
        };
    } catch (e) {
        console.error(`[getStudyTreasury] ${e}`);
    }
}
