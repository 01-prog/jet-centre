import { StudyProgressStep } from '@prisma/client';

import { Box, BoxContent, BoxHeader, BoxTitle } from '@/components/boxes/boxes';
import { ErrorPage } from '@/components/error';
import { DELIVERABLE_STEPS, STUDY_STEPS } from '@/db/types';
import { StudyParams } from '@/routes';

import { getStudyFinalisation } from './actions';
import { FinalisationActions } from './client';

export default async function FinalisationPage({ params }: StudyParams) {
    const { study } = await params;
    const data = await getStudyFinalisation(study);

    if (!data) {
        return (
            <ErrorPage title="Étude introuvable">
                <p>Impossible de charger les données de finalisation.</p>
            </ErrorPage>
        );
    }

    const currentStep =
        data.proceedings?.studyProcessStep ?? StudyProgressStep.Created;
    const isEndPhase =
        Object.values(StudyProgressStep).indexOf(currentStep) >=
        Object.values(StudyProgressStep).indexOf(StudyProgressStep.Ended);

    return (
        <div className="flex flex-col space-y-main">
            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>
                        Finalisation - {data.title ?? data.studyCode}
                    </BoxTitle>
                </BoxHeader>
                <BoxContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Statut actuel :</span>
                            <span
                                className={`px-2 py-1 rounded text-sm ${
                                    isEndPhase
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {STUDY_STEPS[currentStep].display}
                            </span>
                        </div>
                    </div>
                </BoxContent>
            </Box>

            {data.proceedings && data.proceedings.phases.length > 0 && (
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Livrables</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="space-y-2">
                            {data.proceedings.phases.map((phase) => (
                                <div
                                    key={phase.id}
                                    className="flex items-center justify-between p-3 border border-input rounded-md"
                                >
                                    <div>
                                        <span className="font-medium">{phase.title}</span>
                                        <span className="text-muted-foreground ml-2 text-sm">
                                            ({phase.jehs} JEH)
                                        </span>
                                    </div>
                                    <div className="text-sm">
                                        {phase.deliverable ? (
                                            <span
                                                className={`px-2 py-1 rounded ${
                                                    phase.deliverable.status === 'Given'
                                                        ? 'bg-green-100 text-green-800'
                                                        : phase.deliverable.status === 'Finished'
                                                          ? 'bg-blue-100 text-blue-800'
                                                          : 'bg-muted'
                                                }`}
                                            >
                                                {DELIVERABLE_STEPS[phase.deliverable.status].display}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                Pas de livrable
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BoxContent>
                </Box>
            )}

            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>Checklist de finalisation</BoxTitle>
                </BoxHeader>
                <BoxContent>
                    <div className="space-y-3">
                        <FinalisationCheckItem
                            label="PVRF signé"
                            checked={isEndPhase}
                        />
                        <FinalisationCheckItem
                            label="Facturation entreprise"
                            checked={
                                Object.values(StudyProgressStep).indexOf(currentStep) >=
                                Object.values(StudyProgressStep).indexOf(
                                    StudyProgressStep.CompanyFactored
                                )
                            }
                        />
                        <FinalisationCheckItem
                            label="Paiement intervenant"
                            checked={
                                Object.values(StudyProgressStep).indexOf(currentStep) >=
                                Object.values(StudyProgressStep).indexOf(
                                    StudyProgressStep.AssigneePaid
                                )
                            }
                        />
                        <FinalisationCheckItem
                            label="Questionnaire de satisfaction envoyé"
                            checked={
                                Object.values(StudyProgressStep).indexOf(currentStep) >=
                                Object.values(StudyProgressStep).indexOf(
                                    StudyProgressStep.SatisfactionFormSent
                                )
                            }
                        />
                        <FinalisationCheckItem
                            label="Période de garantie terminée"
                            checked={currentStep === StudyProgressStep.WarrantyExpired}
                        />
                    </div>
                </BoxContent>
            </Box>

            {data.proceedings && (
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Actions</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <FinalisationActions
                            studyProceedingId={data.proceedings.id}
                            currentStep={currentStep}
                        />
                    </BoxContent>
                </Box>
            )}

            {data.clients.length > 0 && (
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Contacts client</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="space-y-2">
                            {data.clients.map((sc) => (
                                <div
                                    key={sc.id}
                                    className="p-3 border border-input rounded-md"
                                >
                                    <p className="font-medium">
                                        {sc.client.person.firstName} {sc.client.person.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {sc.client.person.email}
                                    </p>
                                    {sc.client.company && (
                                        <p className="text-sm text-muted-foreground">
                                            {sc.client.company.name}
                                        </p>
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

function FinalisationCheckItem({
    label,
    checked,
}: {
    label: string;
    checked: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <div
                className={`w-4 h-4 rounded-full border-2 ${
                    checked
                        ? 'bg-green-500 border-green-500'
                        : 'border-muted-foreground'
                }`}
            />
            <span className={checked ? 'line-through text-muted-foreground' : ''}>
                {label}
            </span>
        </div>
    );
}
