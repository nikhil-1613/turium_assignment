import { http, HttpResponse } from 'msw';

let services = [

  {
    id: '1',
    name: 'Auth Service',
    type: 'Core',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Initial deployment',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    name: 'Payment Service',
    type: 'Finance',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Initial deployment',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '3',
    name: 'Email Service',
    type: 'Utility',
    status: 'Error',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'SMTP configured',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'Update',
        description: 'SMTP failure',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '4',
    name: 'User Service',
    type: 'Core',
    status: 'Online',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'User management added',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '5',
    name: 'Notification Service',
    type: 'Utility',
    status: 'Offline',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Push notification live',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '6',
    name: 'Analytics Service',
    type: 'Monitoring',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Initial metrics added',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '7',
    name: 'File Upload Service',
    type: 'Storage',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'File storage enabled',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '8',
    name: 'Image Processing',
    type: 'Media',
    status: 'Error',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Image resizing added',
        timestamp: new Date().toISOString(),
      },
      {
        type: 'Update',
        description: 'Service crashed under load',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '9',
    name: 'Search Service',
    type: 'Utility',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'ElasticSearch integration',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '10',
    name: 'Translation Service',
    type: 'Localization',
    status: 'Stopped',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Multi-language support added',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '11',
    name: 'Logging Service',
    type: 'Monitoring',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Log aggregation started',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '12',
    name: 'Session Service',
    type: 'Core',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Session token logic live',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '13',
    name: 'Chat Service',
    type: 'Communication',
    status: 'Error',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Chat messaging activated',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '14',
    name: 'Recommendation Engine',
    type: 'AI',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'ML model deployed',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '15',
    name: 'Backup Service',
    type: 'Utility',
    status: 'Stopped',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Daily backups scheduled',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '16',
    name: 'Video Streaming',
    type: 'Media',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Live streaming enabled',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '17',
    name: 'Billing Service',
    type: 'Finance',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Invoicing and billing live',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '18',
    name: 'Geo Location',
    type: 'Utility',
    status: 'Error',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'IP-based location enabled',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '19',
    name: 'Scheduler Service',
    type: 'Core',
    status: 'Running',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Job scheduling live',
        timestamp: new Date().toISOString(),
      },
    ],
  },
  {
    id: '20',
    name: 'Feedback Service',
    type: 'Utility',
    status: 'Stopped',
    updatedAt: new Date().toISOString(),
    history: [
      {
        type: 'Created',
        description: 'Feedback forms enabled',
        timestamp: new Date().toISOString(),
      },
    ],
  },



  // {
  //   id: '1',
  //   name: 'Auth Service',
  //   type:'core',
  //   status: 'Running',
  //   updatedAt: new Date().toISOString(),
  //   history: [
  //     { type: 'Created', description: 'Initial deployment', timestamp: new Date().toISOString() }
  //   ],
  // },
  // {
  //   id: '2',
  //   name: 'Payment Service',
  //   type:'Finace',
  //   status: 'Running',
  //   updatedAt: new Date().toISOString(),
  //   history: [
  //     { type: 'Created', description: 'Initial deployment', timestamp: new Date().toISOString() }
  //   ],
  // },
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
