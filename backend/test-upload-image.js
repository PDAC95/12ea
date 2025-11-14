import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:8000/api/v1';

let userToken = '';

// Credenciales de usuario de prueba (admin)
const TEST_USER = {
  email: 'dev@jappi.ca',
  password: 'Password123'
};

// Crear imagen de prueba temporal (1x1 pixel PNG)
const createTestImage = (filename) => {
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(base64PNG, 'base64');
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, buffer);
  return filepath;
};

// Crear archivo muy grande (>5MB)
const createLargeFile = (filename) => {
  const buffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, buffer);
  return filepath;
};

// Crear archivo con tipo no permitido
const createInvalidFile = (filename) => {
  const filepath = path.join(__dirname, filename);
  fs.writeFileSync(filepath, 'Este es un archivo de texto');
  return filepath;
};

const cleanup = () => {
  const files = [
    'test-image.png',
    'large-image.png',
    'invalid-file.txt'
  ];

  files.forEach(file => {
    const filepath = path.join(__dirname, file);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  });
};

// Test 1: Login admin
const loginUser = async () => {
  const response = await axios.post(`${API_URL}/auth/admin/login`, TEST_USER);

  if (!response.data.success) {
    throw new Error('Login fallido');
  }

  userToken = response.data.data.token;
  console.log('✅ Login admin exitoso');
  return response.data;
};

// Test 2: Upload sin autenticación (debe fallar)
const uploadWithoutAuth = async () => {
  try {
    const imagePath = createTestImage('test-image.png');
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    await axios.post(
      `${API_URL}/upload/image?folder=temp`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    throw new Error('Debería haber fallado sin autenticación');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Upload sin auth correctamente rechazado (401)');
      return { status: 401 };
    }
    throw error;
  }
};

// Test 3: Upload con autenticación a carpeta temp
const uploadToTemp = async () => {
  const imagePath = createTestImage('test-image.png');
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));

  const response = await axios.post(
    `${API_URL}/upload/image?folder=temp`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error('Upload falló');
  }

  if (!response.data.data.url) {
    throw new Error('No se retornó URL');
  }

  console.log('✅ Upload a /temp exitoso');
  console.log(`   URL: ${response.data.data.url}`);
  return response.data;
};

// Test 4: Upload a carpeta events
const uploadToEvents = async () => {
  const imagePath = createTestImage('test-image.png');
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));

  const response = await axios.post(
    `${API_URL}/upload/image?folder=events`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error('Upload falló');
  }

  if (!response.data.data.url.includes('/events/')) {
    throw new Error('Imagen no está en carpeta events');
  }

  console.log('✅ Upload a /events exitoso');
  console.log(`   URL: ${response.data.data.url}`);
  return response.data;
};

// Test 5: Upload a carpeta blog con subfolder
const uploadToBlogWithSubfolder = async () => {
  const imagePath = createTestImage('test-image.png');
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));

  const response = await axios.post(
    `${API_URL}/upload/image?folder=blog&subfolder=post-123`,
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!response.data.success) {
    throw new Error('Upload falló');
  }

  if (!response.data.data.url.includes('/blog/')) {
    throw new Error('Imagen no está en carpeta blog');
  }

  console.log('✅ Upload a /blog/post-123 exitoso');
  console.log(`   URL: ${response.data.data.url}`);
  return response.data;
};

// Test 6: Upload con carpeta no permitida (debe fallar)
const uploadToInvalidFolder = async () => {
  try {
    const imagePath = createTestImage('test-image.png');
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    await axios.post(
      `${API_URL}/upload/image?folder=hacks`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    throw new Error('Debería haber fallado con carpeta no permitida');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Carpeta no permitida correctamente rechazada (400)');
      return { status: 400 };
    }
    throw error;
  }
};

// Test 7: Upload sin archivo (debe fallar)
const uploadWithoutFile = async () => {
  try {
    const form = new FormData();

    await axios.post(
      `${API_URL}/upload/image?folder=temp`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    throw new Error('Debería haber fallado sin archivo');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Upload sin archivo correctamente rechazado (400)');
      return { status: 400 };
    }
    throw error;
  }
};

// Test 8: Upload archivo muy grande (debe fallar con 413)
const uploadLargeFile = async () => {
  try {
    const imagePath = createLargeFile('large-image.png');
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    await axios.post(
      `${API_URL}/upload/image?folder=temp`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    throw new Error('Debería haber fallado con archivo muy grande');
  } catch (error) {
    if (error.response && (error.response.status === 413 || error.response.status === 400)) {
      console.log('✅ Archivo muy grande correctamente rechazado');
      return { status: error.response.status };
    }
    throw error;
  }
};

// Test 9: Upload tipo de archivo no permitido (debe fallar)
const uploadInvalidFileType = async () => {
  try {
    const filepath = createInvalidFile('invalid-file.txt');
    const form = new FormData();
    form.append('image', fs.createReadStream(filepath));

    await axios.post(
      `${API_URL}/upload/image?folder=temp`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    throw new Error('Debería haber fallado con tipo no permitido');
  } catch (error) {
    if (error.response && (error.response.status === 400 || error.response.status === 415)) {
      console.log('✅ Tipo de archivo no permitido correctamente rechazado');
      return { status: error.response.status };
    }
    throw error;
  }
};

// Runner
const runTests = async () => {
  console.log('\n🧪 TESTING: Task 8.2 - Image Upload Service\n');
  console.log('='.repeat(60));

  const tests = [
    { name: '1. Login Usuario', fn: loginUser },
    { name: '2. Upload sin autenticación (debe fallar)', fn: uploadWithoutAuth },
    { name: '3. Upload a /temp', fn: uploadToTemp },
    { name: '4. Upload a /events', fn: uploadToEvents },
    { name: '5. Upload a /blog con subfolder', fn: uploadToBlogWithSubfolder },
    { name: '6. Carpeta no permitida (debe fallar)', fn: uploadToInvalidFolder },
    { name: '7. Upload sin archivo (debe fallar)', fn: uploadWithoutFile },
    { name: '8. Archivo muy grande (debe fallar)', fn: uploadLargeFile },
    { name: '9. Tipo de archivo no permitido (debe fallar)', fn: uploadInvalidFileType },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n${test.name}...`);
      await test.fn();
      passed++;
    } catch (error) {
      console.error(`❌ ${test.name} falló:`);
      console.error(`   ${error.message}`);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Data:`, error.response.data);
      } else if (error.code) {
        console.error(`   Code: ${error.code}`);
      }
      console.error(`   Stack:`, error.stack?.split('\n').slice(0, 3).join('\n'));
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 RESULTADOS: ${passed}/${tests.length} tests pasaron`);

  if (failed > 0) {
    console.log(`❌ ${failed} tests fallaron`);
  } else {
    console.log('✅ Todos los tests pasaron exitosamente');
  }

  // Cleanup
  cleanup();
  console.log('\n🧹 Archivos temporales eliminados\n');
};

runTests().catch(error => {
  console.error('Error fatal:', error);
  cleanup();
  process.exit(1);
});
