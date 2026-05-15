const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mundial API',
      version: '1.0.0',
      description: 'API REST para administrar equipos y grupos del Mundial de Fútbol',
      contact: {
        name: 'Soporte',
        email: 'soporte@mundial-api.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}/api/v1',
        description: 'Servidor de desarrollo',
        variables: {
          port: { default: '3000' },
        },
      },
    ],
    components: {
      schemas: {
        Equipo: {
          type: 'object',
          properties: {
            id:                 { type: 'integer', example: 1 },
            nombre_pais:        { type: 'string',  example: 'Argentina' },
            codigo_fifa:        { type: 'string',  example: 'ARG', description: 'Exactamente 3 letras mayúsculas' },
            director_tecnico:   { type: 'string',  example: 'Lionel Scaloni' },
            ranking_fifa:       { type: 'integer', example: 1 },
            cantidad_jugadores: { type: 'integer', example: 26, description: 'Entre 23 y 26' },
            estado:             { type: 'boolean', example: true },
            created_at:         { type: 'string',  format: 'date-time' },
            updated_at:         { type: 'string',  format: 'date-time' },
          },
        },
        EquipoInput: {
          type: 'object',
          required: ['nombrePais', 'codigoFifa', 'directorTecnico', 'rankingFifa', 'cantidadJugadores'],
          properties: {
            nombrePais:        { type: 'string',  example: 'Argentina' },
            codigoFifa:        { type: 'string',  example: 'ARG' },
            directorTecnico:   { type: 'string',  example: 'Lionel Scaloni' },
            rankingFifa:       { type: 'integer', example: 1 },
            cantidadJugadores: { type: 'integer', example: 26 },
          },
        },
        Grupo: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            nombre:      { type: 'string',  example: 'Grupo A' },
            descripcion: { type: 'string',  example: 'Grupo principal A' },
            estado:      { type: 'boolean', example: true },
            created_at:  { type: 'string',  format: 'date-time' },
            updated_at:  { type: 'string',  format: 'date-time' },
          },
        },
        GrupoInput: {
          type: 'object',
          required: ['nombre'],
          properties: {
            nombre:      { type: 'string', example: 'Grupo A' },
            descripcion: { type: 'string', example: 'Grupo principal A' },
          },
        },
        FormacionInput: {
          type: 'object',
          required: ['cantidadGrupos'],
          properties: {
            cantidadGrupos: { type: 'integer', example: 4, description: 'Cantidad de grupos a conformar' },
          },
        },
        FormacionResult: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Formación generada exitosamente' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  grupo:   { type: 'string',  example: 'Grupo A' },
                  equipos: { type: 'array', items: { $ref: '#/components/schemas/Equipo' } },
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status:    { type: 'string',  example: 'error' },
            errorCode: { type: 'string',  example: 'E001' },
            message:   { type: 'string',  example: 'El país ya está registrado' },
          },
        },
        ValidationErrorResponse: {
          type: 'object',
          properties: {
            status:  { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Error de validación' },
            errors:  { type: 'array', items: { type: 'object', properties: {
              field:   { type: 'string', example: 'codigoFifa' },
              message: { type: 'string', example: 'El código FIFA debe tener exactamente 3 letras mayúsculas' },
            }}},
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);