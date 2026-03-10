import { Box, BoxContent, BoxHeader, BoxTitle } from '@/components/boxes/boxes';
import { StudyParams } from '@/routes';

import { getStudyAssignees } from './actions';
import ClientsAssignees from './clientsAssignees';

export const metadata = {
    title: 'Sélection des intervenants',
};

export interface InterviewElt {
    questionId: string;
    answer: string;
    tick: boolean;
}

export interface Assignee {
    firstname: string;
    lastname: string;
    email: string;
    experience: string;
    knowledge: string;
    ideas: string;
    je_experience: string;
    cv_path: string;
    interview?: InterviewElt[];
}

export default async function Assignees({ params }: StudyParams) {
    const { study } = await params;
    const data = await getStudyAssignees(study);

    if (!data || data.length === 0) {
        return (
            <div className="flex space-x-main h-full">
                <Box className="w-full">
                    <BoxHeader>
                        <BoxTitle>Sélection des intervenants</BoxTitle>
                    </BoxHeader>
                    <BoxContent>
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <p>
                                Aucune candidature reçue pour le moment. Les candidatures
                                apparaîtront ici après l&apos;envoi du MRI.
                            </p>
                        </div>
                    </BoxContent>
                </Box>
            </div>
        );
    }

    const assignees: Assignee[] = data.map((d) => ({
        ...d,
        email: d.email ?? '',
    }));

    return (
        <div className="flex space-x-main h-full">
            <ClientsAssignees assignees={assignees as [Assignee, ...Assignee[]]} />
        </div>
    );
}
