/**
 * Tip Controller Tests - Entre Amigas
 * Tests unitarios para los endpoints de Tips
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import Tip from '../src/models/Tip.js';
import User from '../src/models/User.js';
import tipsRoutes from '../src/routes/tips.js';
import myTipsRoutes from '../src/routes/myTips.js';
import adminTipsRoutes from '../src/routes/adminTips.js';
import jwt from 'jsonwebtoken';

// Configurar app de Express para tests
const app = express();
app.use(express.json());
app.use('/api/v1/tips', tipsRoutes);
app.use('/api/v1/tips/my', myTipsRoutes);
app.use('/api/v1/admin/tips', adminTipsRoutes);

// Mock de conexión a MongoDB para tests
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/entreamigas-test';
const JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

describe('Tip Controller Tests', () => {
  let testUser;
  let adminUser;
  let userToken;
  let adminToken;
  let approvedTip;
  let pendingTip;

  beforeAll(async () => {
    // Conectar a base de datos de test
    await mongoose.connect(MONGODB_TEST_URI);

    // Crear usuarios de prueba
    testUser = await User.create({
      fullName: 'Regular User',
      email: 'user@test.com',
      password: 'hashedpassword123',
      role: 'user',
      isVerified: true,
    });

    adminUser = await User.create({
      fullName: 'Admin User',
      email: 'admin@test.com',
      password: 'hashedpassword123',
      role: 'admin',
      isVerified: true,
    });

    // Generar tokens JWT
    userToken = jwt.sign(
      { id: testUser._id, email: testUser.email, role: 'user', type: 'auth', isVerified: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    adminToken = jwt.sign(
      { id: adminUser._id, email: adminUser.email, role: 'admin', type: 'auth', isVerified: true },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  afterAll(async () => {
    // Limpiar datos de test
    await Tip.deleteMany({});
    await User.deleteMany({});
    // Cerrar conexión
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpiar tips antes de cada test
    await Tip.deleteMany({});

    // Crear tips de prueba
    approvedTip = await Tip.create({
      title: 'Tip Aprobado de Prueba',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      category: 'Desarrollo Profesional',
      author: testUser._id,
      status: 'approved',
    });

    pendingTip = await Tip.create({
      title: 'Tip Pendiente de Prueba',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      category: 'Finanzas Personales',
      author: testUser._id,
      status: 'pending',
    });
  });

  describe('Public Endpoints', () => {
    describe('GET /api/v1/tips', () => {
      test('should return only approved tips', async () => {
        const res = await request(app).get('/api/v1/tips');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.tips).toBeInstanceOf(Array);
        expect(res.body.data.tips.length).toBe(1);
        expect(res.body.data.tips[0].status).toBeUndefined(); // No debe exponer status
        expect(res.body.data.tips[0].title).toBe(approvedTip.title);
      });

      test('should filter by category', async () => {
        const res = await request(app)
          .get('/api/v1/tips')
          .query({ category: 'Desarrollo Profesional' });

        expect(res.status).toBe(200);
        expect(res.body.data.tips.length).toBe(1);
        expect(res.body.data.tips[0].category).toBe('Desarrollo Profesional');
      });

      test('should return category counts', async () => {
        const res = await request(app).get('/api/v1/tips');

        expect(res.status).toBe(200);
        expect(res.body.data.categoryCounts).toBeDefined();
        expect(res.body.data.categoryCounts['Desarrollo Profesional']).toBe(1);
      });

      test('should paginate results', async () => {
        const res = await request(app)
          .get('/api/v1/tips')
          .query({ page: 1, limit: 10 });

        expect(res.status).toBe(200);
        expect(res.body.pagination).toBeDefined();
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(10);
      });
    });

    describe('GET /api/v1/tips/:id', () => {
      test('should return tip details', async () => {
        const res = await request(app).get(`/api/v1/tips/${approvedTip._id}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe(approvedTip.title);
        expect(res.body.data.content).toBe(approvedTip.content);
      });

      test('should not return pending tips', async () => {
        const res = await request(app).get(`/api/v1/tips/${pendingTip._id}`);

        expect(res.status).toBe(404);
      });

      test('should increment views', async () => {
        const initialViews = approvedTip.views;

        await request(app).get(`/api/v1/tips/${approvedTip._id}`);

        const updatedTip = await Tip.findById(approvedTip._id);
        expect(updatedTip.views).toBe(initialViews + 1);
      });

      test('should return 404 for invalid ID', async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app).get(`/api/v1/tips/${fakeId}`);

        expect(res.status).toBe(404);
      });
    });
  });

  describe('Protected Endpoints (User)', () => {
    describe('POST /api/v1/tips/my/propose', () => {
      test('should create a new tip with valid data', async () => {
        const newTipData = {
          title: 'Nuevo Tip de Prueba',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          category: 'Emprendimiento',
        };

        const res = await request(app)
          .post('/api/v1/tips/my/propose')
          .set('Authorization', `Bearer ${userToken}`)
          .send(newTipData);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe(newTipData.title);
        expect(res.body.data.status).toBe('pending');
      });

      test('should fail without authentication', async () => {
        const newTipData = {
          title: 'Nuevo Tip sin Auth',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          category: 'Emprendimiento',
        };

        const res = await request(app)
          .post('/api/v1/tips/my/propose')
          .send(newTipData);

        expect(res.status).toBe(401);
      });

      test('should fail with title too short', async () => {
        const invalidTipData = {
          title: 'Test', // Menos de 5 caracteres
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          category: 'Emprendimiento',
        };

        const res = await request(app)
          .post('/api/v1/tips/my/propose')
          .set('Authorization', `Bearer ${userToken}`)
          .send(invalidTipData);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should fail with content too short', async () => {
        const invalidTipData = {
          title: 'Valid Title Here',
          content: 'Too short content', // Menos de 100 caracteres
          category: 'Emprendimiento',
        };

        const res = await request(app)
          .post('/api/v1/tips/my/propose')
          .set('Authorization', `Bearer ${userToken}`)
          .send(invalidTipData);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      test('should fail with invalid category', async () => {
        const invalidTipData = {
          title: 'Valid Title Here',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          category: 'Invalid Category',
        };

        const res = await request(app)
          .post('/api/v1/tips/my/propose')
          .set('Authorization', `Bearer ${userToken}`)
          .send(invalidTipData);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('GET /api/v1/tips/my/list', () => {
      test('should return user\'s tips', async () => {
        const res = await request(app)
          .get('/api/v1/tips/my/list')
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.count).toBe(2); // approvedTip + pendingTip
      });

      test('should fail without authentication', async () => {
        const res = await request(app).get('/api/v1/tips/my/list');

        expect(res.status).toBe(401);
      });
    });

    describe('PUT /api/v1/tips/my/:id', () => {
      test('should update own pending tip', async () => {
        const updates = {
          title: 'Título Actualizado',
          content: 'Contenido actualizado con más de 100 caracteres. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        };

        const res = await request(app)
          .put(`/api/v1/tips/my/${pendingTip._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updates);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.title).toBe(updates.title);
      });

      test('should not update approved tip', async () => {
        const updates = {
          title: 'Intento de Actualización',
        };

        const res = await request(app)
          .put(`/api/v1/tips/my/${approvedTip._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send(updates);

        expect(res.status).toBe(400);
      });
    });

    describe('DELETE /api/v1/tips/my/:id', () => {
      test('should delete own pending tip', async () => {
        const res = await request(app)
          .delete(`/api/v1/tips/my/${pendingTip._id}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const deletedTip = await Tip.findById(pendingTip._id);
        expect(deletedTip).toBeNull();
      });

      test('should not delete approved tip', async () => {
        const res = await request(app)
          .delete(`/api/v1/tips/my/${approvedTip._id}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(400);
      });
    });

    describe('POST /api/v1/tips/:id/like', () => {
      test('should add like to tip', async () => {
        const res = await request(app)
          .post(`/api/v1/tips/${approvedTip._id}/like`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.likeCount).toBe(1);
      });

      test('should fail if already liked', async () => {
        // Dar like primero
        await request(app)
          .post(`/api/v1/tips/${approvedTip._id}/like`)
          .set('Authorization', `Bearer ${userToken}`);

        // Intentar dar like de nuevo
        const res = await request(app)
          .post(`/api/v1/tips/${approvedTip._id}/like`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(400);
      });
    });

    describe('DELETE /api/v1/tips/:id/like', () => {
      test('should remove like from tip', async () => {
        // Dar like primero
        await request(app)
          .post(`/api/v1/tips/${approvedTip._id}/like`)
          .set('Authorization', `Bearer ${userToken}`);

        // Quitar like
        const res = await request(app)
          .delete(`/api/v1/tips/${approvedTip._id}/like`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.likeCount).toBe(0);
      });

      test('should fail if not liked', async () => {
        const res = await request(app)
          .delete(`/api/v1/tips/${approvedTip._id}/like`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(400);
      });
    });
  });

  describe('Admin Endpoints', () => {
    describe('GET /api/v1/admin/tips/pending', () => {
      test('should return pending tips', async () => {
        const res = await request(app)
          .get('/api/v1/admin/tips/pending')
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeInstanceOf(Array);
        expect(res.body.count).toBe(1);
        expect(res.body.data[0].status).toBe('pending');
      });

      test('should fail without admin role', async () => {
        const res = await request(app)
          .get('/api/v1/admin/tips/pending')
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
      });
    });

    describe('PUT /api/v1/admin/tips/:id/approve', () => {
      test('should approve pending tip', async () => {
        const res = await request(app)
          .put(`/api/v1/admin/tips/${pendingTip._id}/approve`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('approved');
      });

      test('should fail without admin role', async () => {
        const res = await request(app)
          .put(`/api/v1/admin/tips/${pendingTip._id}/approve`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
      });
    });

    describe('PUT /api/v1/admin/tips/:id/reject', () => {
      test('should reject pending tip with reason', async () => {
        const reason = 'Contenido no apropiado para la comunidad';

        const res = await request(app)
          .put(`/api/v1/admin/tips/${pendingTip._id}/reject`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ reason });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('rejected');
        expect(res.body.data.rejectionReason).toBe(reason);
      });

      test('should fail without reason', async () => {
        const res = await request(app)
          .put(`/api/v1/admin/tips/${pendingTip._id}/reject`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({});

        expect(res.status).toBe(400);
      });

      test('should fail with reason too short', async () => {
        const res = await request(app)
          .put(`/api/v1/admin/tips/${pendingTip._id}/reject`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ reason: 'Corto' }); // Menos de 10 caracteres

        expect(res.status).toBe(400);
      });
    });

    describe('DELETE /api/v1/admin/tips/:id', () => {
      test('should delete any tip', async () => {
        const res = await request(app)
          .delete(`/api/v1/admin/tips/${approvedTip._id}`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const deletedTip = await Tip.findById(approvedTip._id);
        expect(deletedTip).toBeNull();
      });

      test('should fail without admin role', async () => {
        const res = await request(app)
          .delete(`/api/v1/admin/tips/${pendingTip._id}`)
          .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
      });
    });
  });
});
