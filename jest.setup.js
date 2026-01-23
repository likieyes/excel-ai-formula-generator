import '@testing-library/jest-dom'

// Mock Vercel Analytics globally
jest.mock('@vercel/analytics', () => ({
  track: jest.fn(),
  Analytics: () => null
}))