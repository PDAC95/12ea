const BASE_URL = 'http://localhost:8000/api/v1';

// Paso 1: Login como admin
const login = async () => {
  try {
    const response = await fetch(`${BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'dev@jappi.ca',
        password: 'Password123',
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    console.log('✅ Login exitoso');
    return data.data.token;
  } catch (error) {
    console.error('❌ Error en login:', error.message);
    throw error;
  }
};

// Paso 2: Crear artículo
const createBlogPost = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Cómo adaptarse a Canadá: Guía completa',
        content: 'Mudarse a Canadá es un gran paso en la vida. En este artículo, te comparto mis mejores consejos para adaptarte rápidamente a tu nueva vida en este hermoso país. Desde encontrar vivienda hasta hacer nuevas amistades, aquí encontrarás todo lo que necesitas saber.',
        excerpt: 'Descubre los mejores consejos para adaptarte a la vida en Canadá como nueva inmigrante.',
        featuredImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce',
        category: 'Migración',
        tags: ['canadá', 'inmigración', 'consejos'],
        status: 'draft',
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || JSON.stringify(data.errors));
    }

    console.log('✅ Artículo creado:', data.data._id);
    console.log('   Título:', data.data.title);
    console.log('   Slug:', data.data.slug);
    console.log('   Status:', data.data.status);
    return data.data;
  } catch (error) {
    console.error('❌ Error al crear artículo:', error.message);
    throw error;
  }
};

// Paso 3: Listar artículos
const listBlogPosts = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/blog?status=all&limit=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    console.log('✅ Artículos listados:', data.count, '/', data.total);
    data.data.forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title} (${post.status}) - ${post.slug}`);
    });
    return data.data;
  } catch (error) {
    console.error('❌ Error al listar artículos:', error.message);
    throw error;
  }
};

// Paso 4: Publicar artículo
const publishBlogPost = async (token, postId) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/blog/${postId}/publish`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    console.log('✅ Artículo publicado:', data.data._id);
    console.log('   Fecha publicación:', data.data.publishedAt);
    return data.data;
  } catch (error) {
    console.error('❌ Error al publicar artículo:', error.message);
    throw error;
  }
};

// Paso 5: Actualizar artículo
const updateBlogPost = async (token, postId) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/blog/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Cómo adaptarse a Canadá: Guía completa 2025',
        tags: ['canadá', 'inmigración', 'consejos', '2025'],
      }),
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || JSON.stringify(data.errors));
    }

    console.log('✅ Artículo actualizado:', data.data._id);
    console.log('   Nuevo título:', data.data.title);
    console.log('   Nuevo slug:', data.data.slug);
    console.log('   Tags:', data.data.tags.join(', '));
    return data.data;
  } catch (error) {
    console.error('❌ Error al actualizar artículo:', error.message);
    throw error;
  }
};

// Paso 6: Obtener estadísticas
const getBlogStats = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/admin/blog/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    console.log('✅ Estadísticas del blog:');
    console.log('   Total:', data.data.total);
    console.log('   Publicados:', data.data.published);
    console.log('   Borradores:', data.data.drafts);
    console.log('   Destacados:', data.data.featured);
    return data.data;
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
    throw error;
  }
};

// Ejecutar pruebas
const runTests = async () => {
  console.log('\n🧪 Iniciando pruebas de endpoints de Admin Blog...\n');

  try {
    // 1. Login
    const token = await login();
    console.log('');

    // 2. Crear artículo
    const newPost = await createBlogPost(token);
    console.log('');

    // 3. Listar artículos
    await listBlogPosts(token);
    console.log('');

    // 4. Publicar artículo
    await publishBlogPost(token, newPost._id);
    console.log('');

    // 5. Actualizar artículo
    await updateBlogPost(token, newPost._id);
    console.log('');

    // 6. Obtener estadísticas
    await getBlogStats(token);
    console.log('');

    console.log('🎉 Todas las pruebas completadas exitosamente!\n');
  } catch (error) {
    console.log('\n❌ Pruebas fallidas\n');
    process.exit(1);
  }
};

runTests();
