import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatInput from '@/components/ChatInput';

describe('ChatInput', () => {
  it('renders the textarea and send button', () => {
    render(<ChatInput onSend={jest.fn()} disabled={false} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<ChatInput onSend={jest.fn()} disabled={false} />);
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('send button becomes enabled when user types', () => {
    render(<ChatInput onSend={jest.fn()} disabled={false} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByRole('button', { name: /send/i })).not.toBeDisabled();
  });

  it('calls onSend with trimmed value when form is submitted', () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '  Hello AI  ' } });
    fireEvent.submit(textarea.closest('form')!);
    expect(onSend).toHaveBeenCalledWith('Hello AI');
  });

  it('clears the textarea after sending', () => {
    render(<ChatInput onSend={jest.fn()} disabled={false} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.submit(textarea.closest('form')!);
    expect(textarea.value).toBe('');
  });

  it('does not call onSend when disabled prop is true', () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} disabled={true} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    fireEvent.submit(textarea.closest('form')!);
    expect(onSend).not.toHaveBeenCalled();
  });

  it('does not call onSend on Enter key when disabled', () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} disabled={true} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(onSend).not.toHaveBeenCalled();
  });
});
