/**
 * Tip Model Tests - Entre Amigas
 * Tests unitarios para el modelo Tip
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import mongoose from 'mongoose';
import Tip from '../src/models/Tip.js';
import User from '../src/models/User.js';

// Mock de conexión a MongoDB para tests
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/entreamigas-test';

describe('Tip Model Tests', () => {
  let testUser;

  beforeAll(async () => {
    // Conectar a base de datos de test
    await mongoose.connect(MONGODB_TEST_URI);

    // Crear usuario de prueba
    testUser = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: 'user',
      isVerified: true,
    });
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
  });

  describe('Validations', () => {
    test('should create a valid tip', async () => {
      const validTip = {
        title: 'Cómo encontrar trabajo en Canadá',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Desarrollo Profesional',
        author: testUser._id,
        status: 'pending',
      };

      const tip = await Tip.create(validTip);

      expect(tip._id).toBeDefined();
      expect(tip.title).toBe(validTip.title);
      expect(tip.content).toBe(validTip.content);
      expect(tip.category).toBe(validTip.category);
      expect(tip.status).toBe('pending');
      expect(tip.views).toBe(0);
      expect(tip.likes).toEqual([]);
    });

    test('should fail if title is too short', async () => {
      const invalidTip = {
        title: 'Test', // Menos de 5 caracteres
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Desarrollo Profesional',
        author: testUser._id,
      };

      await expect(Tip.create(invalidTip)).rejects.toThrow();
    });

    test('should fail if content is too short', async () => {
      const invalidTip = {
        title: 'Valid Title Here',
        content: 'Too short', // Menos de 100 caracteres
        category: 'Desarrollo Profesional',
        author: testUser._id,
      };

      await expect(Tip.create(invalidTip)).rejects.toThrow();
    });

    test('should fail if category is invalid', async () => {
      const invalidTip = {
        title: 'Valid Title Here',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Invalid Category',
        author: testUser._id,
      };

      await expect(Tip.create(invalidTip)).rejects.toThrow();
    });

    test('should fail if required fields are missing', async () => {
      const invalidTip = {
        title: 'Valid Title Here',
        // Falta content
        category: 'Desarrollo Profesional',
        author: testUser._id,
      };

      await expect(Tip.create(invalidTip)).rejects.toThrow();
    });
  });

  describe('Instance Methods', () => {
    let tip;

    beforeEach(async () => {
      tip = await Tip.create({
        title: 'Test Tip for Methods',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Desarrollo Profesional',
        author: testUser._id,
        status: 'pending',
      });
    });

    test('should approve a tip', async () => {
      const adminId = new mongoose.Types.ObjectId();
      await tip.approve(adminId);

      expect(tip.status).toBe('approved');
      expect(tip.approvedBy).toEqual(adminId);
      expect(tip.approvedAt).toBeInstanceOf(Date);
    });

    test('should reject a tip', async () => {
      const adminId = new mongoose.Types.ObjectId();
      const reason = 'Contenido no apropiado para la comunidad';

      await tip.reject(adminId, reason);

      expect(tip.status).toBe('rejected');
      expect(tip.rejectionReason).toBe(reason);
      expect(tip.rejectedBy).toEqual(adminId);
      expect(tip.rejectedAt).toBeInstanceOf(Date);
    });

    test('should increment views', async () => {
      const initialViews = tip.views;
      await tip.incrementViews();

      expect(tip.views).toBe(initialViews + 1);
    });

    test('should add like', async () => {
      const userId = new mongoose.Types.ObjectId();
      await tip.addLike(userId);

      expect(tip.likes).toContainEqual(userId);
      expect(tip.likes.length).toBe(1);
    });

    test('should remove like', async () => {
      const userId = new mongoose.Types.ObjectId();
      await tip.addLike(userId);
      await tip.removeLike(userId);

      expect(tip.likes).not.toContainEqual(userId);
      expect(tip.likes.length).toBe(0);
    });

    test('should not add duplicate like', async () => {
      const userId = new mongoose.Types.ObjectId();
      await tip.addLike(userId);
      await tip.addLike(userId); // Intentar agregar de nuevo

      expect(tip.likes.length).toBe(1);
    });
  });

  describe('Virtual Fields', () => {
    test('should calculate likeCount correctly', async () => {
      const tip = await Tip.create({
        title: 'Test Tip for Virtuals',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Desarrollo Profesional',
        author: testUser._id,
        status: 'approved',
        likes: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId(),
        ],
      });

      expect(tip.likeCount).toBe(3);
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Crear tips de prueba
      await Tip.create([
        {
          title: 'Pending Tip 1',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          category: 'Desarrollo Profesional',
          author: testUser._id,
          status: 'pending',
        },
        {
          title: 'Approved Tip 1',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          category: 'Finanzas Personales',
          author: testUser._id,
          status: 'approved',
          likes: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
        },
        {
          title: 'Approved Tip 2',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          category: 'Desarrollo Profesional',
          author: testUser._id,
          status: 'approved',
          likes: [new mongoose.Types.ObjectId()],
        },
      ]);
    });

    test('should find pending tips', async () => {
      const pending = await Tip.findPending();

      expect(pending.length).toBe(1);
      expect(pending[0].status).toBe('pending');
    });

    test('should find tips by author', async () => {
      const authorTips = await Tip.findByAuthor(testUser._id);

      expect(authorTips.length).toBe(3);
      authorTips.forEach((tip) => {
        expect(tip.author.toString()).toBe(testUser._id.toString());
      });
    });

    test('should find most liked tips', async () => {
      const mostLiked = await Tip.findMostLiked(2);

      expect(mostLiked.length).toBe(2);
      expect(mostLiked[0].likeCount).toBeGreaterThanOrEqual(mostLiked[1].likeCount);
    });

    test('should get statistics', async () => {
      const stats = await Tip.getStats();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('pending');
      expect(stats).toHaveProperty('approved');
      expect(stats).toHaveProperty('rejected');
      expect(stats).toHaveProperty('byCategory');

      expect(stats.total).toBe(3);
      expect(stats.pending).toBe(1);
      expect(stats.approved).toBe(2);
      expect(stats.rejected).toBe(0);
    });
  });

  describe('Default Values', () => {
    test('should set default status to pending', async () => {
      const tip = await Tip.create({
        title: 'Test Default Status',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Desarrollo Profesional',
        author: testUser._id,
      });

      expect(tip.status).toBe('pending');
    });

    test('should set default views to 0', async () => {
      const tip = await Tip.create({
        title: 'Test Default Views',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Desarrollo Profesional',
        author: testUser._id,
      });

      expect(tip.views).toBe(0);
    });

    test('should set default likes to empty array', async () => {
      const tip = await Tip.create({
        title: 'Test Default Likes',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        category: 'Desarrollo Profesional',
        author: testUser._id,
      });

      expect(tip.likes).toEqual([]);
    });
  });
});
