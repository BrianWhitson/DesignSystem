import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with the provided label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies the primary variant by default', () => {
    render(<Button label="Primary" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('ds-button--primary');
  });

  it('applies the secondary variant', () => {
    render(<Button label="Secondary" variant="secondary" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('ds-button--secondary');
  });

  it('applies the outline variant', () => {
    render(<Button label="Outline" variant="outline" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('ds-button--outline');
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button label="Small" size="sm" />);
    expect(screen.getByRole('button').className).toContain('ds-button--sm');

    rerender(<Button label="Large" size="lg" />);
    expect(screen.getByRole('button').className).toContain('ds-button--lg');
  });

  it('fires onClick handler', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', () => {
    render(<Button label="Disabled" disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
