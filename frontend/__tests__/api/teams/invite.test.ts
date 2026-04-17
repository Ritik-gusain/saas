import { POST } from '@/app/api/teams/invite/route';

// Mocking @supabase/supabase-js
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      auth: {
        getUser: jest.fn(),
        admin: {
          inviteUserByEmail: jest.fn(),
          listUsers: jest.fn(),
        }
      },
      from: jest.fn()
    }))
  };
});

describe('POST /api/teams/invite', () => {
  let req: Request;
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 if no Authorization header is provided', async () => {
    req = new Request('http://localhost/api/teams/invite', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', team_id: '123' })
    });
    
    const res = await POST(req);
    const data = await res.json();
    
    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  // Note: Full integration tests for the API require setting up 
  // complex chains of Supabase mocks (from -> select -> eq -> single).
  // For this unit test suite, ensuring basic auth validation logic is verified.
});