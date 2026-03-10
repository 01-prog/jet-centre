'use client';

import Link from 'next/link';

import { Box, BoxContent, BoxHeader, BoxTitle } from '@/components/boxes/boxes';
import { StudyWithCode } from '@/types/user';

export function StudySummaryList({ studies }: { studies: StudyWithCode[] }) {
    return (
        <Box className="w-full">
            <BoxHeader>
                <BoxTitle>Vos études</BoxTitle>
            </BoxHeader>
            <BoxContent>
                <div className="space-y-2">
                    {studies.map((study) => (
                        <Link
                            key={study.id}
                            href={`/cdp/${study.information.code}/dashboard`}
                            className="block p-3 rounded-md border border-input hover:bg-accent transition-colors"
                        >
                            <p className="font-medium">{study.information.code}</p>
                        </Link>
                    ))}
                </div>
            </BoxContent>
        </Box>
    );
}
