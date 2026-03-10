import { StudyProgressStep } from '@prisma/client';

import { Box, BoxContent, BoxHeader, BoxTitle } from '@/components/boxes/boxes';
import { ErrorPage } from '@/components/error';
import { Task } from '@/components/meta-components/task-bullet-list';
import { STUDY_STEPS } from '@/db/types';
import { StudyParams } from '@/routes';

import { getStudyDashboard } from './actions';
import { FollowMissionTaskList } from './client';
import { StudyProgressTracker } from './progress';

export default async function Page({ params }: StudyParams) {
    const { study } = await params;
    const data = await getStudyDashboard(study);

    if (!data) {
        return (
            <ErrorPage title="Étude introuvable">
                <p>Impossible de charger les données de cette étude.</p>
            </ErrorPage>
        );
    }

    const currentStep = data.proceedings?.studyProcessStep ?? StudyProgressStep.Created;
    const tasks = buildStudyChecklist(data, currentStep);

    return (
        <div className="flex flex-col space-y-main">
            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>
                        {data.studyInfos.title
                            ? `${data.studyInfos.code} - ${data.studyInfos.title}`
                            : data.studyInfos.code}
                    </BoxTitle>
                </BoxHeader>
                <BoxContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">CDPs : </span>
                            {data.cdps.length > 0
                                ? data.cdps
                                      .map(
                                          (cdp) =>
                                              `${cdp.user.person.firstName} ${cdp.user.person.lastName}`
                                      )
                                      .join(', ')
                                : 'Non assigné'}
                        </div>
                        <div>
                            <span className="font-medium">Intervenants : </span>
                            {data.assignees.length > 0
                                ? data.assignees
                                      .map(
                                          (a) =>
                                              `${a.assignee.person.firstName} ${a.assignee.person.lastName}`
                                      )
                                      .join(', ')
                                : 'Non sélectionnés'}
                        </div>
                        <div>
                            <span className="font-medium">Type : </span>
                            {data.studyInfos.cc ? 'Convention de Conseil' : 'Convention Tripartite'}
                        </div>
                        <div>
                            <span className="font-medium">Durée estimée : </span>
                            {data.studyInfos.estimatedDuration
                                ? `${data.studyInfos.estimatedDuration} JEH`
                                : 'Non définie'}
                        </div>
                    </div>
                </BoxContent>
            </Box>
            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>Avancement de l&apos;étude</BoxTitle>
                </BoxHeader>
                <BoxContent>
                    <StudyProgressTracker currentStep={currentStep} />
                </BoxContent>
            </Box>
            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>Checklist du CDP</BoxTitle>
                </BoxHeader>
                <BoxContent>
                    <FollowMissionTaskList initialList={tasks} />
                </BoxContent>
            </Box>
            {data.proceedings &&
                data.proceedings.phases.length > 0 && (
                    <Box className="w-full">
                        <BoxHeader>
                            <BoxTitle>Phases de la mission</BoxTitle>
                        </BoxHeader>
                        <BoxContent>
                            <div className="space-y-2">
                                {data.proceedings.phases.map((phase) => (
                                    <div
                                        key={phase.id}
                                        className="flex items-center justify-between p-2 border border-input rounded-md"
                                    >
                                        <div>
                                            <span className="font-medium">{phase.title}</span>
                                            <span className="text-muted-foreground ml-2">
                                                ({phase.jehs} JEH &times; {phase.unitPrice}&euro;)
                                            </span>
                                        </div>
                                        {phase.deliverable && (
                                            <span className="text-xs px-2 py-1 rounded bg-muted">
                                                {
                                                    STUDY_STEPS[
                                                        phase.deliverable
                                                            .status as unknown as StudyProgressStep
                                                    ]?.display ?? phase.deliverable.status
                                                }
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </BoxContent>
                    </Box>
                )}
        </div>
    );
}

function buildStudyChecklist(
    data: NonNullable<Awaited<ReturnType<typeof getStudyDashboard>>>,
    currentStep: StudyProgressStep
): Task[] {
    const stepOrder = Object.values(StudyProgressStep);
    const currentIndex = stepOrder.indexOf(currentStep);

    const hasMris = data.mris.length > 0;
    const hasSentMri = data.mris.some((m) => m.status === 'Sent');
    const hasAssignees = data.assignees.length > 0;
    const hasPhases =
        data.proceedings !== null &&
        data.proceedings !== undefined &&
        data.proceedings.phases.length > 0;
    const hasClients = data.clients.length > 0;

    const tasks: Task[] = [
        {
            id: 'settings',
            name: "Configurer les paramètres de l'étude",
            date: new Date(),
            checked: data.studyInfos.title !== null,
        },
        {
            id: 'clients',
            name: 'Ajouter les contacts client',
            date: new Date(),
            checked: hasClients,
        },
        {
            id: 'phases',
            name: 'Définir les phases de la mission',
            date: new Date(),
            checked: hasPhases,
        },
        {
            id: 'mri',
            name: 'Rédiger le MRI',
            date: new Date(),
            checked: hasMris,
        },
        {
            id: 'mri-sent',
            name: 'Faire valider et envoyer le MRI',
            date: new Date(),
            checked: hasSentMri,
        },
        {
            id: 'assignees',
            name: 'Sélectionner les intervenants',
            date: new Date(),
            checked: hasAssignees,
        },
        {
            id: 'tripartite',
            name: 'Organiser la réunion tripartite',
            date: new Date(),
            checked: currentIndex >= stepOrder.indexOf(StudyProgressStep.TripartiteMeeting),
        },
        {
            id: 'docs',
            name: 'Rédiger les documents (CE, RM, BA...)',
            date: new Date(),
            checked: currentIndex >= stepOrder.indexOf(StudyProgressStep.DocumentsWrote),
        },
        {
            id: 'sign',
            name: 'Faire signer les documents',
            date: new Date(),
            checked: currentIndex >= stepOrder.indexOf(StudyProgressStep.InStudy),
        },
        {
            id: 'mission',
            name: "Suivre l'avancement de la mission",
            date: new Date(),
            checked: currentIndex >= stepOrder.indexOf(StudyProgressStep.Ended),
        },
    ];

    return tasks;
}
