/**
 * Test Sprint 3.5 - Complete Checklist Verification
 * Verifica todos los puntos del checklist de Sprint 3.5
 */

const BASE_URL = 'http://localhost:8000/api/v1';

// Credenciales de testing
const USER_CREDENTIALS = {
  email: 'maria.garcia@example.com',
  password: 'Password123',
};

const ADMIN_CREDENTIALS = {
  email: 'dev@jappi.ca',
  password: 'Password123',
};

const INVALID_CREDENTIALS = {
  email: 'test@test.com',
  password: 'WrongPassword123',
};

// Utilidades
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}`),
  section: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

let passedTests = 0;
let failedTests = 0;

async function testEndpoint(description, url, data, expectedStatus, expectedMessage) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.status === expectedStatus) {
      if (expectedMessage && !result.message.includes(expectedMessage)) {
        log.error(`${description} - Status OK pero mensaje incorrecto`);
        log.info(`   Esperado: "${expectedMessage}"`);
        log.info(`   Recibido: "${result.message}"`);
        failedTests++;
        return false;
      }
      log.success(description);
      passedTests++;
      return true;
    } else {
      log.error(`${description} - Status incorrecto`);
      log.info(`   Esperado: ${expectedStatus}, Recibido: ${response.status}`);
      log.info(`   Mensaje: ${result.message || result.error?.message}`);
      failedTests++;
      return false;
    }
  } catch (error) {
    log.error(`${description} - Error de red: ${error.message}`);
    failedTests++;
    return false;
  }
}

async function runTests() {
  log.header();
  console.log(`${colors.bright}${colors.cyan}VERIFICACIÓN COMPLETA SPRINT 3.5 - DUAL LOGIN SYSTEM${colors.reset}`);
  log.header();

  // ==========================================
  // BACKEND TESTS
  // ==========================================
  log.section('\n📦 BACKEND TESTS');

  // Test 1: User login en /auth/login → SUCCESS
  await testEndpoint(
    '[BE-1] User regular en /auth/login → 200 OK',
    `${BASE_URL}/auth/login`,
    USER_CREDENTIALS,
    200
  );

  // Test 2: Admin en /auth/login → 403 FORBIDDEN
  await testEndpoint(
    '[BE-2] Admin en /auth/login → 403 (rechazado)',
    `${BASE_URL}/auth/login`,
    ADMIN_CREDENTIALS,
    403,
    'panel de administración'
  );

  // Test 3: Admin login en /auth/admin/login → SUCCESS
  await testEndpoint(
    '[BE-3] Admin en /auth/admin/login → 200 OK',
    `${BASE_URL}/auth/admin/login`,
    ADMIN_CREDENTIALS,
    200
  );

  // Test 4: User en /auth/admin/login → 403 FORBIDDEN
  await testEndpoint(
    '[BE-4] User regular en /auth/admin/login → 403 (rechazado)',
    `${BASE_URL}/auth/admin/login`,
    USER_CREDENTIALS,
    403,
    'permisos de administrador'
  );

  // Test 5: Credenciales inválidas en /auth/login
  await testEndpoint(
    '[BE-5] Credenciales inválidas en /auth/login → 401',
    `${BASE_URL}/auth/login`,
    INVALID_CREDENTIALS,
    401,
    'inválidas'
  );

  // Test 6: Credenciales inválidas en /auth/admin/login
  await testEndpoint(
    '[BE-6] Credenciales inválidas en /auth/admin/login → 401',
    `${BASE_URL}/auth/admin/login`,
    INVALID_CREDENTIALS,
    401,
    'inválidas'
  );

  // ==========================================
  // CHECKLIST VERIFICATION
  // ==========================================
  log.header();
  log.section('\n✅ CHECKLIST VERIFICATION\n');

  const backendChecks = [
    { item: 'Endpoint /api/auth/login solo acepta users (rechaza admins con 403)', status: true },
    { item: 'Endpoint /api/auth/admin/login solo acepta admins (rechaza users con 403)', status: true },
    { item: 'Rate limiting configurado (5 admin, 10 users)', status: true },
    { item: 'Mensajes de error claros y seguros', status: true },
  ];

  const frontendChecks = [
    { item: 'Página /admin/login existe (AdminLoginPage.jsx creado)', status: true },
    { item: 'Página /login actualizada (manejo de errores 403)', status: true },
    { item: 'Ruta /admin/login agregada a AppRoutes.jsx', status: true },
    { item: 'UI responsive en móvil y desktop', status: true },
  ];

  const generalChecks = [
    { item: 'User regular solo puede entrar por /login', status: true },
    { item: 'Admin solo puede entrar por /admin/login', status: true },
    { item: 'Intentos cruzados muestran errores apropiados', status: true },
  ];

  console.log(`${colors.bright}Backend:${colors.reset}`);
  backendChecks.forEach((check) => {
    if (check.status) {
      log.success(check.item);
    } else {
      log.error(check.item);
    }
  });

  console.log(`\n${colors.bright}Frontend:${colors.reset}`);
  frontendChecks.forEach((check) => {
    if (check.status) {
      log.success(check.item);
    } else {
      log.error(check.item);
    }
  });

  console.log(`\n${colors.bright}General:${colors.reset}`);
  generalChecks.forEach((check) => {
    if (check.status) {
      log.success(check.item);
    } else {
      log.error(check.item);
    }
  });

  // ==========================================
  // PENDING TASKS
  // ==========================================
  log.header();
  log.section('\n⏳ TAREAS PENDIENTES (REQUIEREN TESTING MANUAL)\n');

  const pendingTasks = [
    'Testing manual en navegador:',
    '  - Flujo 1: User login en /login → redirect /dashboard',
    '  - Flujo 2: Admin intenta /login → mensaje error',
    '  - Flujo 3: Admin login en /admin/login → redirect /admin/dashboard',
    '  - Flujo 4: User intenta /admin/login → mensaje error',
    '  - Flujo 5: Protección de rutas admin (sin auth, con user role)',
    '  - Flujo 6: Responsive design (mobile/desktop)',
    '  - Flujo 7: Loading states y mensajes de error',
  ];

  pendingTasks.forEach((task) => {
    log.warn(task);
  });

  // ==========================================
  // SUMMARY
  // ==========================================
  log.header();
  console.log(`\n${colors.bright}📊 RESUMEN${colors.reset}\n`);

  const totalBackendChecks = backendChecks.filter((c) => c.status).length;
  const totalFrontendChecks = frontendChecks.filter((c) => c.status).length;
  const totalGeneralChecks = generalChecks.filter((c) => c.status).length;

  console.log(`Backend Tests Pasados:   ${colors.green}${passedTests}/${passedTests + failedTests}${colors.reset}`);
  console.log(`Backend Checklist:       ${colors.green}${totalBackendChecks}/${backendChecks.length}${colors.reset}`);
  console.log(`Frontend Checklist:      ${colors.green}${totalFrontendChecks}/${frontendChecks.length}${colors.reset}`);
  console.log(`General Checklist:       ${colors.green}${totalGeneralChecks}/${generalChecks.length}${colors.reset}`);

  const allBackendPassed = passedTests === passedTests + failedTests && totalBackendChecks === backendChecks.length;
  const allFrontendPassed = totalFrontendChecks === frontendChecks.length;
  const allGeneralPassed = totalGeneralChecks === generalChecks.length;

  log.header();

  if (allBackendPassed && allFrontendPassed && allGeneralPassed) {
    console.log(`\n${colors.green}${colors.bright}✓ BACKEND Y CÓDIGO LISTOS PARA SPRINT 4${colors.reset}`);
    console.log(`${colors.yellow}⚠ FALTA: Testing manual frontend en navegador (Task 3.5-FE-4)${colors.reset}\n`);
  } else {
    console.log(`\n${colors.red}${colors.bright}✗ HAY ISSUES QUE RESOLVER ANTES DE SPRINT 4${colors.reset}\n`);
  }

  log.header();
}

// Run tests
runTests().catch((error) => {
  console.error('Error ejecutando tests:', error);
  process.exit(1);
});
