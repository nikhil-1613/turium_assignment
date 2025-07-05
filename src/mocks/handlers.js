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
  // ... other predefined services ...
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

// import { http, HttpResponse } from 'msw';

// let services = [
//   {
//     id: '1',
//     name: 'Auth Service',
//     status: 'Running',
//     updatedAt: new Date().toISOString(),
//     history: [
//       {
//         type: 'Created',
//         description: 'Initial deployment',
//         timestamp: new Date().toISOString(),
//       },
//     ],
//   },
//   {
//     id: '2',
//     name: 'Payments Service',
//     status: 'Error',
//     updatedAt: new Date().toISOString(),
//     history: [
//       {
//         type: 'Created',
//         description: 'Payments module initialized',
//         timestamp: new Date().toISOString(),
//       },
//     ],
//   },
//   {
//     id: '3',
//     name: 'User Profile Service',
//     status: 'Stopped',
//     updatedAt: new Date().toISOString(),
//     history: [
//       {
//         type: 'Created',
//         description: 'User profile v1',
//         timestamp: new Date().toISOString(),
//       },
//     ],
//   },
// ];

// export const handlers = [
//   //base method
//   http.get('/', () => {
//     return HttpResponse.text('Home route (mocked)');
//   }),
//   // GET: Fetch all services
//   http.get('/api/services', () => {
//     return HttpResponse.json(services);
//   }),

//   // POST: Add a new service
//   http.post('/api/services', async ({ request }) => {
//     const newService = await request.json();
//     const createdService = {
//       ...newService,
//       id: Date.now().toString(),
//       updatedAt: new Date().toISOString(),
//     };
//     services.push(createdService);
//     return HttpResponse.json({ message: 'Created', service: createdService }, { status: 201 });
//   }),

//   // PUT: Update an existing service
//   http.put('/api/services/:id', async ({ request, params }) => {
//     const updated = await request.json();
//     const id = params.id;

//     services = services.map((s) =>
//       s.id === id ? { ...updated, id, updatedAt: new Date().toISOString() } : s
//     );

//     return HttpResponse.json({ message: 'Updated' });
//   }),

//   // DELETE: Remove a service by ID
//   http.delete('/api/services/:id', ({ params }) => {
//     const id = params.id;
//     services = services.filter((s) => s.id !== id);
//     return HttpResponse.json({ message: 'Deleted' });
//   }),
// ];
