'use server';

import { StudyProgressStep } from '@prisma/client';

import prisma from '@/db';

export async function getTreasuryOverview() {
    try {
        const studies = await prisma.study.findMany({
            include: {
                information: {
                    select: {
                        code: true,
                        title: true,
                        applicationFee: true,
                        cc: true,
                    },
                },
                studyProceedings: {
                    include: {
                        phases: true,
                    },
                },
            },
        });

        const studySummaries = studies.map((study) => {
            const phases = study.studyProceedings?.phases ?? [];
            const totalJEH = phases.reduce((sum, p) => sum + p.jehs, 0);
            const totalHT = phases.reduce((sum, p) => sum + p.jehs * p.unitPrice, 0);
            const step = study.studyProceedings?.studyProcessStep ?? StudyProgressStep.Created;

            return {
                id: study.id,
                code: study.information.code,
                title: study.information.title,
                cc: study.information.cc,
                applicationFee: study.information.applicationFee,
                step,
                totalJEH,
                totalHT,
                totalWithFees: totalHT * (1 + study.information.applicationFee / 100),
            };
        });

        const globalTotalHT = studySummaries.reduce((sum, s) => sum + s.totalHT, 0);
        const globalTotalWithFees = studySummaries.reduce((sum, s) => sum + s.totalWithFees, 0);
        const globalTotalJEH = studySummaries.reduce((sum, s) => sum + s.totalJEH, 0);

        const factored = studySummaries.filter(
            (s) =>
                Object.values(StudyProgressStep).indexOf(s.step) >=
                Object.values(StudyProgressStep).indexOf(StudyProgressStep.CompanyFactored)
        );
        const factoredTotal = factored.reduce((sum, s) => sum + s.totalWithFees, 0);

        return {
            studies: studySummaries,
            global: {
                totalStudies: studies.length,
                totalJEH: globalTotalJEH,
                totalHT: globalTotalHT,
                totalWithFees: globalTotalWithFees,
                factoredTotal,
            },
        };
    } catch (e) {
        console.error(`[getTreasuryOverview] ${e}`);
    }
}
