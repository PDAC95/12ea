import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tip from '../models/Tip.js';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Seed Script para Tips Comunitarios - Entre Amigas
 * Crea tips de ejemplo en diferentes categorías y estados
 */

const seedTips = async () => {
  try {
    console.log('\n🌱 Iniciando seed de tips comunitarios...\n');

    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 2. Buscar o crear usuario de prueba (autor de los tips)
    let testUser = await User.findOne({ email: 'dev@jappi.ca' });

    if (!testUser) {
      console.log('⚠️  Usuario de prueba no encontrado, creando uno nuevo...');
      testUser = await User.create({
        fullName: 'Usuario de Desarrollo',
        preferredName: 'Dev User',
        email: 'dev@jappi.ca',
        password: 'Password123',
        phone: '+1234567890',
        birthday: new Date('1990-01-01'),
        city: 'Toronto',
        authProvider: 'local',
        isVerified: true,
        role: 'admin',
      });
      console.log(`✅ Usuario creado: ${testUser.email}\n`);
    } else {
      console.log(`✅ Usuario encontrado: ${testUser.email}\n`);
    }

    // 3. Limpiar tips existentes (opcional)
    const deleteCount = await Tip.countDocuments();
    if (deleteCount > 0) {
      console.log(`🗑️  Eliminando ${deleteCount} tips existentes...`);
      await Tip.deleteMany({});
      console.log('✅ Tips anteriores eliminados\n');
    }

    // 4. Definir tips de ejemplo
    const tips = [
      // ========================================
      // TIP 1 - Inmigración y Adaptación (APPROVED)
      // ========================================
      {
        title: 'Cómo Obtener tu SIN Number el Mismo Día que Llegas a Canadá',
        content: `No esperes semanas para obtener tu Social Insurance Number (SIN). Apenas llegues al aeropearson, dirígete a cualquier oficina de Service Canada. Lleva tu pasaporte, confirmación de residencia permanente o permiso de trabajo, y comprobante de dirección canadiense (puede ser una carta de un amigo o reserva de hotel temporal). El proceso toma 15-30 minutos y te dan el SIN inmediatamente. Sin este número no puedes trabajar legalmente ni abrir cuentas bancarias, así que debe ser tu PRIMERA prioridad al llegar. Pro tip: ve temprano en la mañana (antes de las 9am) para evitar filas largas. Algunas ubicaciones de Service Canada permiten citas online, lo cual te ahorra tiempo. No pagues a nadie por este servicio, es completamente gratuito.`,
        category: 'Inmigración y Adaptación',
        author: testUser._id,
        status: 'approved',
        approvedBy: testUser._id,
        approvedAt: new Date('2025-01-15'),
        views: 145,
        likes: [testUser._id],
      },

      // ========================================
      // TIP 2 - Emprendimiento (APPROVED)
      // ========================================
      {
        title: 'Registra tu Negocio en Ontario en 3 Pasos Simples',
        content: `Registrar tu negocio en Ontario es más fácil de lo que piensas. Paso 1: Decide el tipo de negocio (Sole Proprietorship es el más simple para empezar). Paso 2: Busca la disponibilidad del nombre en ontario.ca/businessnames y regístralo online por $60 CAD. Paso 3: Obtén tu Business Number del CRA (Canada Revenue Agency) gratuitamente en canada.ca/cra. Todo el proceso toma 1-2 días. No necesitas abogado para un negocio básico. Una vez registrado, abre una cuenta bancaria empresarial (RBC y TD tienen buenas opciones para startups). Consejo extra: únete a grupos de Facebook como "Emprendedoras Latinas en Toronto" donde compartimos experiencias y contactos de contadores accesibles que entienden nuestra realidad migratoria.`,
        category: 'Emprendimiento',
        author: testUser._id,
        status: 'approved',
        approvedBy: testUser._id,
        approvedAt: new Date('2025-01-18'),
        views: 98,
        likes: [],
      },

      // ========================================
      // TIP 3 - Finanzas Personales (PENDING)
      // ========================================
      {
        title: 'Construye tu Credit Score desde Cero en Canadá',
        content: `Llegué a Canadá con cero historial crediticio, lo que significa que no podía rentar apartamento ni conseguir tarjeta de crédito. Aquí está mi estrategia que funcionó en 6 meses: Paso 1: Abre una cuenta bancaria en TD, RBC o Scotiabank (las tres ofrecen cuentas para newcomers sin fees el primer año). Paso 2: Solicita una tarjeta de crédito SECURED - depositas $500-$1000 como garantía y eso se convierte en tu límite de crédito. Paso 3: Usa la tarjeta para compras pequeñas (café, groceries) y PAGA EL TOTAL cada mes. Paso 4: Después de 3-6 meses, aplica a una tarjeta regular. Paso 5: Nunca uses más del 30% de tu límite y siempre paga a tiempo. En mi caso, empecé con 0 credit score y en 12 meses llegué a 720. Ahora tengo 3 tarjetas, renté apartamento sin problema y calificé para un auto loan con buen interés.`,
        category: 'Finanzas Personales',
        author: testUser._id,
        status: 'pending',
        views: 12,
        likes: [],
      },

      // ========================================
      // TIP 4 - Educación (APPROVED)
      // ========================================
      {
        title: 'Recursos GRATIS para Mejorar tu Inglés en Toronto',
        content: `No gastes miles de dólares en cursos privados de inglés. Toronto ofrece recursos GRATUITOS increíbles. 1) Toronto Public Library: Clases de ESL (English as Second Language) completamente gratis en todas las sucursales. Horarios matutinos, vespertinos y fines de semana. Solo necesitas tu library card (también gratis). 2) LINC Program: Government-funded English classes hasta nivel 7. Aplica en toronto.ca/linc. Incluye childcare en algunos centros. 3) Conversation Circles: Sesiones informales para practicar conversación, también en bibliotecas. 4) Apps: Duolingo (básico), BBC Learning English (intermedio), ELSA Speak (pronunciación). 5) Grupos de Intercambio de Idiomas en Meetup: Practicas inglés mientras ayudas a alguien con español. Pro tip: Combina clases formales con consumo de contenido en inglés (Netflix con subtítulos en inglés, podcasts, YouTube). Yo pasé de nivel 5 a 8 en un año usando solo recursos gratuitos.`,
        category: 'Educación',
        author: testUser._id,
        status: 'approved',
        approvedBy: testUser._id,
        approvedAt: new Date('2025-01-20'),
        views: 203,
        likes: [testUser._id],
      },

      // ========================================
      // TIP 5 - Salud y Bienestar (PENDING)
      // ========================================
      {
        title: 'Cómo Acceder a Terapia de Salud Mental Gratuita o de Bajo Costo',
        content: `La salud mental es crucial durante el proceso migratorio, pero la terapia privada en Canadá cuesta $150-$250 por sesión. Aquí están tus opciones accesibles: 1) OHIP cubre sesiones con psicólogos en hospitales - pide referral a tu family doctor. Espera 2-4 meses pero es gratis. 2) Community Health Centres ofrecen counselling gratuito o sliding scale (pagas según ingresos). Busca "community health centre" + tu área en Google. 3) CAMH (Centre for Addiction and Mental Health) tiene programas gratis incluyendo grupos de apoyo para migrantes. 4) Apps cubiertas por OHIP: Mindbeacon, AbilitiCBT - terapia online gratuita para residentes de Ontario. 5) Crisis lines 24/7: Connex Ontario 1-866-531-2600 (inglés y español). No esperes a estar en crisis para buscar ayuda. El duelo migratorio es real y mereces apoyo profesional.`,
        category: 'Salud y Bienestar',
        author: testUser._id,
        status: 'pending',
        views: 8,
        likes: [],
      },

      // ========================================
      // TIP 6 - Desarrollo Profesional (APPROVED)
      // ========================================
      {
        title: 'Adapta tu CV al Formato Canadiense en 5 Pasos',
        content: `Tu CV latinoamericano NO funcionará en Canadá. Aquí está el formato que me consiguió entrevistas: 1) NUNCA incluyas foto, edad, estado civil, o número de hijos - es ilegal que empleadores lo pidan y te descartarán automáticamente por incluirlo. 2) Máximo 2 páginas. Canadá valora la concisión. 3) Formato ATS-friendly: usa fuentes simples (Arial, Calibri), evita tablas complejas, guarda como .docx y .pdf. 4) Cuantifica logros: "Aumenté ventas 35% en 6 meses" vs "Responsable de ventas". 5) Adapta tu CV para CADA aplicación usando keywords del job posting. Usa verbos de acción: led, managed, developed, increased. Secciones clave: Contact Info, Professional Summary (3-4 líneas), Work Experience (últimos 10 años), Education, Skills, Certifications. Omite referencias (se piden después). Tools gratis: Canva tiene templates canadienses, Jobscan analiza qué tan bien tu CV matchea con job postings. Mi CV pasó de 0 respuestas a 10 entrevistas en un mes aplicando estos cambios.`,
        category: 'Desarrollo Profesional',
        author: testUser._id,
        status: 'approved',
        approvedBy: testUser._id,
        approvedAt: new Date('2025-01-22'),
        views: 167,
        likes: [testUser._id],
      },

      // ========================================
      // TIP 7 - Vivienda (REJECTED - Ejemplo)
      // ========================================
      {
        title: 'Negocia tu Renta y Ahorra Cientos de Dólares',
        content: `En Toronto puedes negociar tu renta mensual si sabes cómo. Contacta directamente al landlord y ofrece pagar 6 meses adelantados a cambio de $100-200 descuento mensual. Funciona siempre.`,
        category: 'Vivienda',
        author: testUser._id,
        status: 'rejected',
        rejectionReason: 'El contenido es muy breve (menos de 100 caracteres requeridos) y la estrategia sugerida no es práctica ni legal en muchos casos. Por favor expande el contenido con más detalles, alternativas realistas y considera las regulaciones del Landlord and Tenant Board de Ontario.',
        approvedBy: testUser._id,
        approvedAt: new Date('2025-01-23'),
        views: 5,
        likes: [],
      },

      // ========================================
      // TIP 8 - Networking (APPROVED)
      // ========================================
      {
        title: 'LinkedIn en Canadá: 7 Estrategias que Funcionan para Conseguir Trabajo',
        content: `LinkedIn es LA herramienta para conseguir trabajo en Canadá. El 80% de trabajos se llenan por networking, no por aplicaciones online. Aquí mi estrategia que me consiguió mi actual empleo: 1) Foto profesional (no selfie) - sonríe, fondo neutro, vestimenta business casual. 2) Headline potente: No solo "Marketing Professional" sino "Digital Marketing Specialist | Helping Tech Startups Scale | Bilingual EN/ES". 3) Cambia tu ubicación a tu ciudad canadiense INMEDIATAMENTE, incluso si aún no has llegado. 4) Personaliza tu URL: linkedin.com/in/tunombre. 5) Pide recomendaciones a ex-jefes y colegas (mínimo 3). 6) Comparte contenido relevante de tu industria 2-3 veces por semana. 7) CRUCIAL: Conéctate con recruiters de tu área usando búsqueda "recruiter + [tu industria] + Toronto". Envía mensaje personalizado mencionando tu expertise y que estás buscando oportunidades. No uses el Open to Work badge (recruiters dicen que es red flag). En cambio, activa "Open to work" solo visible para recruiters. Dedica 30 minutos diarios a LinkedIn: comentar posts, conectar con gente de tu industria, aplicar a trabajos. Consistency es clave.`,
        category: 'Networking',
        author: testUser._id,
        status: 'approved',
        approvedBy: testUser._id,
        approvedAt: new Date('2025-01-25'),
        views: 189,
        likes: [testUser._id],
      },
    ];

    // 5. Insertar tips en la base de datos
    console.log('💡 Insertando tips...\n');
    const insertedTips = await Tip.insertMany(tips);
    console.log(`✅ ${insertedTips.length} tips insertados exitosamente\n`);

    // 6. Mostrar resumen de tips creados
    console.log('📊 Resumen de tips creados:\n');
    insertedTips.forEach((tip, index) => {
      const statusEmoji = tip.status === 'approved' ? '✅' : tip.status === 'pending' ? '⏳' : '❌';
      console.log(`${index + 1}. ${tip.title}`);
      console.log(`   📂 Categoría: ${tip.category}`);
      console.log(`   ${statusEmoji} Status: ${tip.status}`);
      console.log(`   👁️  Vistas: ${tip.views}`);
      console.log(`   ❤️  Likes: ${tip.likeCount}`);
      if (tip.status === 'rejected') {
        console.log(`   ⚠️  Razón rechazo: ${tip.rejectionReason.substring(0, 80)}...`);
      }
      console.log('');
    });

    // 7. Mostrar estadísticas generales
    const stats = await Tip.getStats();
    console.log('📈 Estadísticas generales:');
    console.log(`   Total tips: ${stats.total}`);
    console.log(`   Aprobados: ${stats.approved}`);
    console.log(`   Pendientes: ${stats.pending}`);
    console.log(`   Rechazados: ${stats.rejected}`);
    console.log(`   Total vistas: ${stats.totalViews}`);
    console.log(`   Total likes: ${stats.totalLikes}`);
    console.log('');
    console.log('   Por categoría (solo aprobados):');
    stats.byCategory.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} tip(s)`);
    });
    console.log('');

    console.log('✅ Seed de tips comunitarios completado exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Ejecutar seed
seedTips();
