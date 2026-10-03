/// <reference types="jest" />
import { hourLabel } from '@/lib/time';

describe('hour labels', () => {
  it('reads the day in 12-hour time', () => {
    expect(hourLabel(0)).toBe('12am');
    expect(hourLabel(9)).toBe('9am');
    expect(hourLabel(12)).toBe('12pm');
    expect(hourLabel(22)).toBe('10pm');
  });

  it('calls the end of the last window midnight, not noon', () => {
    // Patterns' latest window runs 10pm to 24:00: "between 10pm and 12am".
    expect(hourLabel(24)).toBe('12am');
  });
});
