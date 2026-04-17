import { classNames } from '@/utils/helpers';

describe('classNames utility', () => {
  it('merges multiple class names correctly', () => {
    expect(classNames('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('ignores falsy values', () => {
    expect(classNames('bg-red-500', null, false, undefined, 'text-white')).toBe('bg-red-500 text-white');
  });

  it('handles empty inputs', () => {
    expect(classNames()).toBe('');
  });
});