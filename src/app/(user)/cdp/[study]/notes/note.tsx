'use client';

import { useCallback, useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { useDebouncedCallback } from 'use-debounce';

import {
    Box,
    BoxHeader,
    BoxHeaderBlock,
    BoxTitle,
    BoxCollapseButton,
    BoxDragHandle,
    BoxCollapser,
    BoxContent,
} from '@/components/boxes/boxes';
import { DragHandle } from '@/components/meta-components/sortableList';
import MDXEditor from '@/components/note/mdxEditor';
import { Button } from '@/components/ui/button';

import { deleteStudyNote, updateStudyNote } from './actions';

export default function Note({
    id,
    title,
    markdown,
    dragHandleProps,
}: {
    id: string;
    title: string;
    markdown: string;
    dragHandleProps: DragHandle;
}) {
    const [collapse, setCollapse] = useState(true);

    const debouncedSave = useDebouncedCallback((content: string) => {
        updateStudyNote(id, content);
    }, 1000);

    const handleDelete = useCallback(() => {
        deleteStudyNote(id).then(() => {
            window.location.reload();
        });
    }, [id]);

    return (
        <Box className="w-full">
            <BoxHeader>
                <BoxTitle>{title}</BoxTitle>
                <BoxHeaderBlock>
                    <Button variant="ghost" className="m-0 p-2" onClick={handleDelete}>
                        <FaTrash />
                    </Button>
                    <BoxCollapseButton collapse={collapse} setCollapse={setCollapse} />
                    <BoxDragHandle {...dragHandleProps} />
                </BoxHeaderBlock>
            </BoxHeader>
            <BoxCollapser collapse={collapse}>
                <BoxContent>
                    <MDXEditor
                        markdown={markdown}
                        displayToolbar={true}
                        onChange={debouncedSave}
                    />
                </BoxContent>
            </BoxCollapser>
        </Box>
    );
}
