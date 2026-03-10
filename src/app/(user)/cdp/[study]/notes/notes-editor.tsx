'use client';

import {
    Box,
    BoxButtonPlus,
    BoxContent,
    BoxHeader,
    BoxHeaderBlock,
    BoxTitle,
} from '@/components/boxes/boxes';
import { SortableList, useSortableList } from '@/components/meta-components/sortableList';

import { createStudyNote } from './actions';
import Note from './note';

export interface NoteData {
    id: string;
    title: string;
    markdown: string;
    position: number;
}

interface NotesEditorProps {
    studyId: string;
    initialNotes: NoteData[];
}

export function NotesEditor({ studyId, initialNotes }: NotesEditorProps) {
    const mdList = useSortableList(initialNotes);

    const handleAddNote = async () => {
        const newNote = await createStudyNote(studyId, 'Nouvelle note');
        if (newNote) {
            mdList.addItem(newNote);
        }
    };

    return (
        <Box className="w-full h-full">
            <BoxHeader>
                <BoxTitle>Notes</BoxTitle>
                <BoxHeaderBlock>
                    <BoxButtonPlus onClick={handleAddNote} />
                </BoxHeaderBlock>
            </BoxHeader>
            <BoxContent>
                {mdList.items.length === 0 ? (
                    <div className="flex items-center justify-center p-8 text-muted-foreground">
                        <p>
                            Aucune note pour le moment. Cliquez sur + pour en ajouter une.
                        </p>
                    </div>
                ) : (
                    <SortableList
                        {...mdList}
                        className="h-full"
                        render={(note, dragHandleProps) => (
                            <Note {...note} dragHandleProps={dragHandleProps} />
                        )}
                    />
                )}
            </BoxContent>
        </Box>
    );
}
