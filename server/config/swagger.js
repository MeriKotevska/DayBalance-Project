const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DayBalance API',
      version: '1.0.0',
      description:
        'REST API for the DayBalance healthy daily habit planner. ' +
        'Part 3 of the university Web Programming project.',
    },
    servers: [
      { url: '/', description: 'DayBalance API' },
    ],
    components: {
      parameters: {
        IdParam: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', pattern: '^[0-9a-fA-F]{24}$' },
          description: 'MongoDB ObjectId',
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationError' },
            },
          },
        },
        Conflict: {
          description: 'Duplicate / conflict',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
            details: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'ValidationError' },
            message: { type: 'string', example: 'Request validation failed.' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  value: {},
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            role: { type: 'string', enum: ['user', 'admin'], default: 'user' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CategoryInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 50 },
            description: { type: 'string', maxLength: 200 },
          },
        },
        Habit: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            category: { $ref: '#/components/schemas/Category' },
            owner: { $ref: '#/components/schemas/User' },
            timeOfDay: { type: 'string', enum: ['morning', 'afternoon', 'evening', 'anytime'] },
            frequency: { type: 'string', enum: ['daily', 'weekly', 'weekdays', 'weekends', 'custom'] },
            duration: { type: 'integer', minimum: 1, maximum: 480 },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            reminder: { type: 'string', pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$' },
            active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        HabitInput: {
          type: 'object',
          required: ['name', 'category', 'owner'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100 },
            description: { type: 'string', maxLength: 500 },
            category: { type: 'string', description: 'Category ObjectId' },
            owner: { type: 'string', description: 'User ObjectId' },
            timeOfDay: { type: 'string', enum: ['morning', 'afternoon', 'evening', 'anytime'] },
            frequency: { type: 'string', enum: ['daily', 'weekly', 'weekdays', 'weekends', 'custom'] },
            duration: { type: 'integer', minimum: 1, maximum: 480 },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            reminder: { type: 'string' },
            active: { type: 'boolean' },
          },
        },
        HabitCompletion: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            habit: { $ref: '#/components/schemas/Habit' },
            user: { $ref: '#/components/schemas/User' },
            date: { type: 'string', format: 'date-time' },
            dayKey: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
            completed: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        HabitCompletionInput: {
          type: 'object',
          required: ['habit', 'user'],
          properties: {
            habit: { type: 'string', description: 'Habit ObjectId' },
            user: { type: 'string', description: 'User ObjectId' },
            date: { type: 'string', format: 'date-time' },
            completed: { type: 'boolean' },
          },
        },
        HealthyTip: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            category: { $ref: '#/components/schemas/Category' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        HealthyTipInput: {
          type: 'object',
          required: ['title', 'content', 'category'],
          properties: {
            title: { type: 'string', minLength: 3, maxLength: 120 },
            content: { type: 'string', maxLength: 2000 },
            category: { type: 'string', description: 'Category ObjectId' },
          },
        },
        ActivityHistory: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            action: { type: 'string' },
            targetType: { type: 'string', enum: ['Habit', 'HabitCompletion', 'Category', 'HealthyTip', 'User'] },
            targetId: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ActivityHistoryInput: {
          type: 'object',
          required: ['user', 'action', 'targetType', 'targetId'],
          properties: {
            user: { type: 'string', description: 'User ObjectId' },
            action: { type: 'string', maxLength: 100 },
            targetType: { type: 'string', enum: ['Habit', 'HabitCompletion', 'Category', 'HealthyTip', 'User'] },
            targetId: { type: 'string', description: 'Target ObjectId' },
            date: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./server/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
