import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600 text-white'); // Primary variant
  });

  it('applies the secondary variant class correctly', () => {
    render(<Button variant="secondary">Secondary Action</Button>);
    const button = screen.getByRole('button', { name: /secondary action/i });
    expect(button).toHaveClass('bg-slate-200 text-slate-900');
  });

  it('applies the danger variant class correctly', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-red-600 text-white');
  });

  it('merges custom class names', () => {
    render(<Button className="w-full mt-4">Full Width</Button>);
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveClass('w-full mt-4');
    expect(button).toHaveClass('bg-blue-600'); // Still retains base variant
  });
});