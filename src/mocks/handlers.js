import { http, HttpResponse } from 'msw';

let services = [
  {
    id: '1',
    name: 'Auth Service',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      { type: 'Created', description: 'Initial deployment', timestamp: new Date().toISOString() }
    ],
  },
];

export const handlers = [
  // GET all services
  http.get('/api/services', () => HttpResponse.json(services)),

  // POST new service
  http.post('/api/services', async ({ request }) => {
    const svc = await request.json();
    const newService = {
      ...svc,
      id: Date.now().toString(),
      updatedAt: new Date().toISOString(),
      history: svc.history || [],
    };
    services.unshift(newService);
    return HttpResponse.json({ service: newService }, { status: 201 });
  }),

  // PUT updates
  http.put('/api/services/:id', async ({ request, params }) => {
    const updated = await request.json();
    const { id } = params;
    updated.id = id;
    updated.updatedAt = new Date().toISOString();
    services = [updated, ...services.filter((s) => s.id !== id)];
    return HttpResponse.json({ service: updated });
  }),

  // DELETE
  http.delete('/api/services/:id', ({ params }) => {
    services = services.filter((s) => s.id !== params.id);
    return HttpResponse.json({ message: 'Deleted' });
  }),
];
