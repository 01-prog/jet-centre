import { ErrorPage } from '@/components/error';
import { StudyParams } from '@/routes';

import { getStudyNotes } from './actions';
import { NotesEditor } from './notes-editor';

export default async function NotesPage({ params }: StudyParams) {
    const { study } = await params;
    const data = await getStudyNotes(study);

    if (!data) {
        return (
            <ErrorPage title="Erreur">
                <p>Impossible de charger les notes de cette étude.</p>
            </ErrorPage>
        );
    }

    return <NotesEditor studyId={data.studyId} initialNotes={data.notes} />;
}
