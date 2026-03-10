'use server';

import prisma from '@/db';

export async function getStudyAssignees(studyCode: string) {
    try {
        const studyInfos = await prisma.studyInfos.findUnique({
            where: { code: studyCode },
            include: {
                study: {
                    include: {
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
                                formInterview: true,
                                mriForm: true,
                            },
                        },
                    },
                },
            },
        });
        if (!studyInfos?.study) return undefined;
        return studyInfos.study.studyAssignees.map((sa) => ({
            id: sa.id,
            firstname: sa.assignee.person.firstName,
            lastname: sa.assignee.person.lastName,
            email: sa.assignee.person.email,
            taken: sa.taken,
            selectionNotes: sa.selectionNotes,
            experience:
                sa.mriForm.length > 0 ? sa.mriForm[0].experience : '',
            knowledge:
                sa.mriForm.length > 0 ? sa.mriForm[0].knowledge : '',
            ideas:
                sa.mriForm.length > 0 ? sa.mriForm[0].ideas : '',
            je_experience:
                sa.mriForm.length > 0 ? String(sa.mriForm[0].jeExperience) : '',
            cv_path: '',
            interview: sa.formInterview
                ? [
                      {
                          questionId: 'approach',
                          answer: sa.formInterview.approach,
                          tick: false,
                      },
                      {
                          questionId: 'courses',
                          answer: sa.formInterview.courses,
                          tick: false,
                      },
                      {
                          questionId: 'starS',
                          answer: sa.formInterview.starS,
                          tick: false,
                      },
                      {
                          questionId: 'starT',
                          answer: sa.formInterview.starT,
                          tick: false,
                      },
                      {
                          questionId: 'starA',
                          answer: sa.formInterview.starA,
                          tick: false,
                      },
                      {
                          questionId: 'starR',
                          answer: sa.formInterview.starR,
                          tick: false,
                      },
                      {
                          questionId: 'motivation',
                          answer: sa.formInterview.motivation,
                          tick: false,
                      },
                  ]
                : undefined,
        }));
    } catch (e) {
        console.error(`[getStudyAssignees] ${e}`);
    }
}
