import { Box, BoxContent, BoxHeader, BoxTitle } from '@/components/boxes/boxes';
import { ErrorPage } from '@/components/error';
import { STUDY_STEPS } from '@/db/types';
import { StudyParams } from '@/routes';

import { getStudyTreasury } from './actions';

export default async function TresoPage({ params }: StudyParams) {
    const { study } = await params;
    const data = await getStudyTreasury(study);

    if (!data) {
        return (
            <ErrorPage title="Étude introuvable">
                <p>Impossible de charger les données de trésorerie.</p>
            </ErrorPage>
        );
    }

    return (
        <div className="flex flex-col space-y-main">
            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>
                        Trésorerie - {data.title ?? data.studyCode}
                    </BoxTitle>
                </BoxHeader>
                <BoxContent>
                    <div className="grid grid-cols-2 gap-4">
                        <SummaryCard
                            label="Total JEH"
                            value={String(data.summary.totalJEH)}
                        />
                        <SummaryCard
                            label="Montant HT"
                            value={`${data.summary.totalHT.toFixed(2)} \u20AC`}
                        />
                        <SummaryCard
                            label={`Montant avec frais (${data.applicationFee}%)`}
                            value={`${data.summary.totalWithFees.toFixed(2)} \u20AC`}
                        />
                        <SummaryCard
                            label="Prix unitaire moyen"
                            value={`${data.summary.averageUnitPrice.toFixed(2)} \u20AC/JEH`}
                        />
                    </div>
                </BoxContent>
            </Box>

            {data.currentStep && (
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Statut financier</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <p>
                            <span className="font-medium">Avancement : </span>
                            {STUDY_STEPS[data.currentStep].display}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Type : {data.cc ? 'Convention de Conseil' : 'Convention Tripartite'}
                        </p>
                    </BoxContent>
                </Box>
            )}

            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>Détail par phase</BoxTitle>
                </BoxHeader>
                <BoxContent>
                    {data.phases.length === 0 ? (
                        <p className="text-muted-foreground">Aucune phase définie.</p>
                    ) : (
                        <div className="space-y-2">
                            {data.phases.map((phase) => (
                                <div
                                    key={phase.id}
                                    className="flex items-center justify-between p-3 border border-input rounded-md"
                                >
                                    <div>
                                        <span className="font-medium">{phase.title}</span>
                                    </div>
                                    <div className="text-sm text-right">
                                        <p>
                                            {phase.jehs} JEH &times; {phase.unitPrice}&euro; ={' '}
                                            <span className="font-medium">
                                                {(phase.jehs * phase.unitPrice).toFixed(2)}&euro;
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </BoxContent>
            </Box>

            {data.assignees.length > 0 && (
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Intervenants</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="space-y-2">
                            {data.assignees.map((sa) => (
                                <div
                                    key={sa.id}
                                    className="p-3 border border-input rounded-md"
                                >
                                    <p className="font-medium">
                                        {sa.assignee.person.firstName}{' '}
                                        {sa.assignee.person.lastName}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </BoxContent>
                </Box>
            )}
        </div>
    );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-4 border border-input rounded-md">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
    );
}
