import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dropzone } from '../Dropzone';

describe('Dropzone', () => {
  const noop = vi.fn();

  it('renders upload prompt when no files', () => {
    render(<Dropzone onFilesSelected={noop} files={[]} />);
    expect(screen.getByText(/Drag & drop photos or PDFs/)).toBeInTheDocument();
    expect(screen.getByText(/click/)).toBeInTheDocument();
  });

  it('shows file count when image files are attached', () => {
    const files = [
      new File(['img1'], 'photo1.jpg', { type: 'image/jpeg' }),
      new File(['img2'], 'photo2.png', { type: 'image/png' }),
    ];
    render(<Dropzone onFilesSelected={noop} files={files} />);
    expect(screen.getByText(/2 image\(s\)/)).toBeInTheDocument();
    expect(screen.getByText(/attached/)).toBeInTheDocument();
  });

  it('shows file count when PDF files are attached', () => {
    const files = [
      new File(['pdf1'], 'report.pdf', { type: 'application/pdf' }),
    ];
    render(<Dropzone onFilesSelected={noop} files={files} />);
    expect(screen.getByText(/1 PDF\(s\)/)).toBeInTheDocument();
  });

  it('shows combined count for images and PDFs', () => {
    const files = [
      new File(['img'], 'photo.jpg', { type: 'image/jpeg' }),
      new File(['pdf'], 'report.pdf', { type: 'application/pdf' }),
    ];
    render(<Dropzone onFilesSelected={noop} files={files} />);
    expect(screen.getByText(/1 image\(s\)/)).toBeInTheDocument();
    expect(screen.getByText(/1 PDF\(s\)/)).toBeInTheDocument();
  });

  it('accepts image and PDF files via input', () => {
    render(<Dropzone onFilesSelected={noop} files={[]} />);
    const input = document.getElementById('fileUpload') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.getAttribute('accept')).toBe('image/*,.pdf');
  });

  it('has correct aria-label', () => {
    render(<Dropzone onFilesSelected={noop} files={[]} />);
    expect(
      screen.getByRole('button', {
        name: /upload medical images or pdf documents/i,
      })
    ).toBeInTheDocument();
  });
});
