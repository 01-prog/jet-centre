import { Suspense } from 'react';

import { LogoBird } from '@/components/logo/logo';
import { getViewer } from '@/data/user';
import { getUserStudies } from '@/data/user';

import { StudySummaryList } from './study-summary';

export default async function HomePage() {
    return (
        <div className="flex w-full h-full place-items-center justify-center">
            <div className="p-main flex flex-col items-center gap-main w-full max-w-4xl">
                <div className="flex flex-col items-center gap-2">
                    <LogoBird />
                    <h1 className="text-3xl">
                        Bienvenue sur Jet Centre, l&apos;ERP de Telecom Etude !
                    </h1>
                </div>
                <p>
                    Si vous voyez cette page, c&apos;est que vous êtes bien login ! Vous pouvez
                    vérifier votre rôle en haut de la sidebar.
                </p>
                <p>
                    Si vous ne voyez pas de sidebar, c&apos;est que votre rôle a été mal défini.
                    Dans ce cas n&apos;hésitez pas à contacter le pôle info.
                </p>
                <Suspense>
                    <UserStudiesSummary />
                </Suspense>
            </div>
        </div>
    );
}

async function UserStudiesSummary() {
    const viewerResult = await getViewer();
    if (viewerResult.status !== 'success') return null;
    const studies = await getUserStudies(viewerResult.viewer);
    if (studies.length === 0) return null;
    return <StudySummaryList studies={studies} />;
}
