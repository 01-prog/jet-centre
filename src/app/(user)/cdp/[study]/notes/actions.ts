'use server';

import prisma from '@/db';

export async function getStudyNotes(studyCode: string) {
    try {
        const studyInfos = await prisma.studyInfos.findUnique({
            where: { code: studyCode },
            include: {
                study: {
                    include: {
                        notes: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
        });
        if (!studyInfos?.study) return undefined;
        return {
            studyId: studyInfos.study.id,
            notes: studyInfos.study.notes.map((note) => ({
                id: note.id,
                title: note.title,
                markdown: note.content,
                position: note.position,
            })),
        };
    } catch (e) {
        console.error(`[getStudyNotes] ${e}`);
    }
}

export async function createStudyNote(studyId: string, title: string) {
    try {
        const maxPosition = await prisma.studyNote.aggregate({
            where: { studyId },
            _max: { position: true },
        });
        const note = await prisma.studyNote.create({
            data: {
                title,
                content: '',
                studyId,
                position: (maxPosition._max.position ?? -1) + 1,
            },
        });
        return {
            id: note.id,
            title: note.title,
            markdown: note.content,
            position: note.position,
        };
    } catch (e) {
        console.error(`[createStudyNote] ${e}`);
    }
}

export async function updateStudyNote(noteId: string, content: string) {
    try {
        await prisma.studyNote.update({
            where: { id: noteId },
            data: { content, updatedAt: new Date() },
        });
    } catch (e) {
        console.error(`[updateStudyNote] ${e}`);
    }
}

export async function updateStudyNoteTitle(noteId: string, title: string) {
    try {
        await prisma.studyNote.update({
            where: { id: noteId },
            data: { title },
        });
    } catch (e) {
        console.error(`[updateStudyNoteTitle] ${e}`);
    }
}

export async function deleteStudyNote(noteId: string) {
    try {
        await prisma.studyNote.delete({
            where: { id: noteId },
        });
    } catch (e) {
        console.error(`[deleteStudyNote] ${e}`);
    }
}

export async function reorderStudyNotes(noteIds: string[]) {
    try {
        await Promise.all(
            noteIds.map((id, index) =>
                prisma.studyNote.update({
                    where: { id },
                    data: { position: index },
                })
            )
        );
    } catch (e) {
        console.error(`[reorderStudyNotes] ${e}`);
    }
}
