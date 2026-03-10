import Link from 'next/link';

import { Box, BoxContent, BoxHeader, BoxTitle } from '@/components/boxes/boxes';
import { ErrorPage } from '@/components/error';
import { STUDY_STEPS } from '@/db/types';

import { getTreasuryOverview } from './actions';

export default async function TreasuryDashboardPage() {
    const data = await getTreasuryOverview();

    if (!data) {
        return (
            <ErrorPage title="Erreur">
                <p>Impossible de charger les données de trésorerie.</p>
            </ErrorPage>
        );
    }

    return (
        <div className="flex flex-col space-y-main">
            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>Vue d&apos;ensemble - Trésorerie</BoxTitle>
                </BoxHeader>
                <BoxContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <SummaryCard
                            label="Études"
                            value={String(data.global.totalStudies)}
                        />
                        <SummaryCard
                            label="Total JEH"
                            value={String(data.global.totalJEH)}
                        />
                        <SummaryCard
                            label="CA signé HT"
                            value={`${data.global.totalHT.toFixed(2)} \u20AC`}
                        />
                        <SummaryCard
                            label="CA facturé"
                            value={`${data.global.factoredTotal.toFixed(2)} \u20AC`}
                        />
                    </div>
                </BoxContent>
            </Box>

            <Box className="w-full">
                <BoxHeader>
                    <BoxTitle>Études</BoxTitle>
                </BoxHeader>
                <BoxContent>
                    {data.studies.length === 0 ? (
                        <p className="text-muted-foreground">Aucune étude en cours.</p>
                    ) : (
                        <div className="space-y-2">
                            {data.studies.map((study) => (
                                <Link
                                    key={study.id}
                                    href={`/cdp/${study.code}/treso`}
                                    className="flex items-center justify-between p-3 border border-input rounded-md hover:bg-accent transition-colors"
                                >
                                    <div>
                                        <span className="font-medium">{study.code}</span>
                                        {study.title && (
                                            <span className="text-muted-foreground ml-2">
                                                - {study.title}
                                            </span>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {STUDY_STEPS[study.step].display}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p className="font-medium">
                                            {study.totalWithFees.toFixed(2)} &euro;
                                        </p>
                                        <p className="text-muted-foreground">
                                            {study.totalJEH} JEH
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </BoxContent>
            </Box>
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
