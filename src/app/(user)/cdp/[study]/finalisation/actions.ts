'use server';

import { StudyProgressStep } from '@prisma/client';

import prisma from '@/db';

export async function getStudyFinalisation(studyCode: string) {
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
                        clients: {
                            include: {
                                client: {
                                    include: {
                                        person: {
                                            select: { firstName: true, lastName: true, email: true },
                                        },
                                        company: true,
                                    },
                                },
                                satisfaction: true,
                            },
                        },
                        studyAssignees: {
                            where: { taken: true },
                            include: {
                                assignee: {
                                    include: {
                                        person: {
                                            select: { firstName: true, lastName: true, email: true },
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
        return {
            studyCode: studyInfos.code,
            title: studyInfos.title,
            studyId: studyInfos.study.id,
            proceedings: studyInfos.study.studyProceedings,
            clients: studyInfos.study.clients,
            assignees: studyInfos.study.studyAssignees,
        };
    } catch (e) {
        console.error(`[getStudyFinalisation] ${e}`);
    }
}

export async function updateStudyFinalStep(
    studyProceedingId: string,
    step: StudyProgressStep
) {
    try {
        await prisma.studyProceedings.update({
            where: { id: studyProceedingId },
            data: { studyProcessStep: step },
        });
    } catch (e) {
        console.error(`[updateStudyFinalStep] ${e}`);
    }
}
