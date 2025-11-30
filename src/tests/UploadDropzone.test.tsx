import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadDropzone from '../components/upload/UploadDropzone';

describe('UploadDropzone', () => {
    it('renders dropzone text', () => {
        render(<UploadDropzone onFilesSelected={() => { }} />);
        expect(screen.getByText(/Drag & drop files here/i)).toBeInTheDocument();
    });

    it('calls onFilesSelected when files are dropped', async () => {
        const onFilesSelected = jest.fn();
        render(<UploadDropzone onFilesSelected={onFilesSelected} />);

        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const input = screen.getByRole('presentation').querySelector('input');

        if (input) {
            Object.defineProperty(input, 'files', {
                value: [file],
            });

            fireEvent.change(input);
        }

        await waitFor(() => {
            expect(onFilesSelected).toHaveBeenCalledTimes(1);
            expect(onFilesSelected).toHaveBeenCalledWith(expect.arrayContaining([file]));
        });
    });
});
