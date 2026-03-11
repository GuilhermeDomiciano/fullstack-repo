import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import HealthCheck from '../../src/frontend/components/HealthCheck';
import apiClient from '../../src/frontend/services/apiClient';

vi.mock('../../src/frontend/services/apiClient');

describe('HealthCheck component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    apiClient.get = vi.fn(() => new Promise(() => {}));
    render(<HealthCheck />);
    expect(screen.getByText(/checking backend connectivity/i)).toBeInTheDocument();
  });

  it('renders health data when backend responds successfully', async () => {
    apiClient.get = vi.fn().mockResolvedValue({
      success: true,
      data: {
        status: 'ok',
        timestamp: '2026-03-11T00:00:00.000Z',
        version: '1.0.0',
        environment: 'development',
      },
      message: 'Service is healthy',
    });

    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText('ok')).toBeInTheDocument();
      expect(screen.getByText('1.0.0')).toBeInTheDocument();
      expect(screen.getByText('development')).toBeInTheDocument();
    });
  });

  it('renders error state when backend returns failure', async () => {
    apiClient.get = vi.fn().mockResolvedValue({
      success: false,
      error: { code: 'SERVICE_UNAVAILABLE', message: 'Service is not healthy' },
    });

    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText('Backend Unreachable')).toBeInTheDocument();
      expect(screen.getByText('Service is not healthy')).toBeInTheDocument();
    });
  });

  it('renders error state when fetch throws a network error', async () => {
    apiClient.get = vi.fn().mockRejectedValue(new Error('Network Error'));

    render(<HealthCheck />);

    await waitFor(() => {
      expect(screen.getByText('Backend Unreachable')).toBeInTheDocument();
      expect(screen.getByText('Unable to reach the backend API')).toBeInTheDocument();
    });
  });
});
