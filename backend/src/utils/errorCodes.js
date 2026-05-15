const ERROR_CODES = {
  // Equipos
  E001: 'E001', 
  E002: 'E002', 
  E003: 'E003', 
  E004: 'E004', 
  E005: 'E005', 

  // Grupos
  E006: 'E006', 
  E007: 'E007', 

  // Formación
  E008: 'E008', 
  E009: 'E009', 
  E010: 'E010', 
  E011: 'E011', 
  E012: 'E012', 

  // Generales
  E013: 'E013', 
  E014: 'E014', 
  E015: 'E015', 
};

const ERROR_MESSAGES = {
  E001: 'El nombre del país ya está registrado',
  E002: 'El código FIFA ya está registrado',
  E003: 'El código FIFA debe tener exactamente 3 letras mayúsculas',
  E004: 'El ranking FIFA debe ser un número entero positivo',
  E005: 'La cantidad de jugadores debe estar entre 23 y 26',
  E006: 'El nombre del grupo ya está registrado',
  E007: 'Grupo no encontrado',
  E008: 'La cantidad de grupos solicitada supera los grupos registrados en base de datos',
  E009: 'Los equipos registrados no son divisibles entre la cantidad de grupos solicitada. No deben quedar equipos sin asignar',
  E010: 'No se puede formar un solo grupo con todos los equipos',
  E011: 'No hay suficientes equipos registrados para generar la formación',
  E012: 'Debe solicitar al menos 2 grupos',
  E013: 'El recurso solicitado no existe',
  E014: 'Error interno del servidor',
  E015: 'Equipo no encontrado',
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };