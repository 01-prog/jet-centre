'use server';

import prisma from '@/db';

export async function getStudyDashboard(studyCode: string) {
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
                        cdps: {
                            include: {
                                user: {
                                    include: {
                                        person: { select: { firstName: true, lastName: true } },
                                    },
                                },
                            },
                        },
                        mris: {
                            select: { id: true, status: true, title: true },
                        },
                        studyAssignees: {
                            include: {
                                assignee: {
                                    include: {
                                        person: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                            where: { taken: true },
                        },
                        clients: {
                            include: {
                                client: {
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
        return {
            studyInfos: {
                code: studyInfos.code,
                title: studyInfos.title,
                domains: studyInfos.domains,
                cc: studyInfos.cc,
                estimatedDuration: studyInfos.estimatedDuration,
                deadlinePreStudy: studyInfos.deadlinePreStudy,
            },
            proceedings: studyInfos.study.studyProceedings,
            cdps: studyInfos.study.cdps,
            mris: studyInfos.study.mris,
            assignees: studyInfos.study.studyAssignees,
            clients: studyInfos.study.clients,
        };
    } catch (e) {
        console.error(`[getStudyDashboard] ${e}`);
    }
}

export type StudyDashboardData = NonNullable<Awaited<ReturnType<typeof getStudyDashboard>>>;
