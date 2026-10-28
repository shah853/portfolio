require('dotenv').config();

const baseUrl = (process.env.BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const results = [];
let token = '';
let createdSkillId = '';
let createdMessageId = '';

const request = async (path, options = {}) => {
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && typeof options.body !== 'string') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  return { response, data };
};

const check = async (name, operation) => {
  try {
    const detail = await operation();
    results.push({ name, status: 'PASS', detail: detail || '' });
  } catch (error) {
    results.push({ name, status: 'FAIL', detail: error.message });
  }
};

const expectOk = async (path, options) => {
  const { response, data } = await request(path, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return data;
};

const runSmokeTest = async () => {
  await check('Health endpoint', async () => {
    const data = await expectOk('/health');
    if (data?.status !== 'ok') throw new Error('Unexpected health response');
    return `database state ${data.db}`;
  });

  await check('Admin login', async () => {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
    }
    const data = await expectOk('/auth/login', {
      method: 'POST',
      body: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      },
    });
    if (!data?.token) throw new Error('Login response did not include a token');
    token = data.token;
    return 'authenticated';
  });

  await check('GET /auth/me', async () => {
    if (!token) throw new Error('Skipped because admin login failed');
    await expectOk('/auth/me');
    return 'authorized';
  });

  await check('GET /admin/dashboard', async () => {
    if (!token) throw new Error('Skipped because admin login failed');
    await expectOk('/admin/dashboard');
  });

  for (const path of ['/projects', '/skills', '/certificates', '/settings']) {
    await check(`GET ${path}`, async () => {
      const data = await expectOk(path);
      if (!Array.isArray(data) && path !== '/settings') {
        throw new Error('Expected a list response');
      }
    });
  }

  await check('POST /skills', async () => {
    if (!token) throw new Error('Skipped because admin login failed');
    const timestamp = Date.now();
    const data = await expectOk('/skills', {
      method: 'POST',
      body: {
        name: `smoke-test-${timestamp}`,
        category: 'tools',
        level: 'beginner',
      },
    });
    if (!data?._id) throw new Error('Skill create response did not include an ID');
    createdSkillId = data._id;
    return 'test skill created';
  });

  await check('DELETE smoke-test skill', async () => {
    if (!createdSkillId) throw new Error('No test skill was created');
    await expectOk(`/skills/${createdSkillId}`, { method: 'DELETE' });
    createdSkillId = '';
    return 'test skill removed';
  });

  await check('POST /messages', async () => {
    const timestamp = Date.now();
    const data = await expectOk('/messages', {
      method: 'POST',
      body: {
        name: 'Portfolio smoke test',
        email: `smoke-${timestamp}@example.com`,
        subject: 'Automated smoke test',
        message: 'Temporary test message; it will be deleted immediately.',
      },
    });
    if (!data?._id) throw new Error('Message create response did not include an ID');
    createdMessageId = data._id;
    return 'test message created';
  });

  await check('DELETE smoke-test message', async () => {
    if (!createdMessageId || !token) {
      throw new Error('No test message or admin token is available');
    }
    await expectOk(`/messages/${createdMessageId}`, { method: 'DELETE' });
    createdMessageId = '';
    return 'test message removed';
  });

  if (createdSkillId && token) {
    await check('Cleanup smoke-test skill', async () => {
      await expectOk(`/skills/${createdSkillId}`, { method: 'DELETE' });
      createdSkillId = '';
    });
  }
  if (createdMessageId && token) {
    await check('Cleanup smoke-test message', async () => {
      await expectOk(`/messages/${createdMessageId}`, { method: 'DELETE' });
      createdMessageId = '';
    });
  }

  const nameWidth = Math.max(...results.map((result) => result.name.length), 4);
  console.log(`\n${'CHECK'.padEnd(nameWidth)}  RESULT  DETAILS`);
  console.log(`${'-'.repeat(nameWidth)}  ------  -------`);
  results.forEach(({ name, status, detail }) => {
    console.log(`${name.padEnd(nameWidth)}  ${status.padEnd(6)}  ${detail}`);
  });

  if (results.some((result) => result.status === 'FAIL')) {
    process.exitCode = 1;
  }
};

runSmokeTest().catch(() => {
  console.error('Smoke test failed unexpectedly.');
  process.exitCode = 1;
});
