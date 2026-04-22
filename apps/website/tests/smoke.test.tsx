import { render, screen } from '@testing-library/react';
import Hero from '../app/components/Hero';

test('renders primary headline and key UI', () => {
  render(<Hero variant="roi" />);

  // Prefer role+name over loose text to avoid ambiguity
  const h1 = screen.getByRole('heading', { level: 1, name: /roi in 4 weeks/i });
  expect(h1).toBeInTheDocument();

  // Section title next to the placeholder chart
  expect(
    screen.getByText(/projected revenue recovered/i)
  ).toBeInTheDocument();

  // Primary CTAs by accessible name
  expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /see how it works/i })).toBeInTheDocument();
});
