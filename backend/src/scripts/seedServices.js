import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';
import User from '../models/User.js';

dotenv.config();

/**
 * Script de Seed para Servicios - Entre Amigas
 * Popula la base de datos con servicios profesionales de ejemplo
 *
 * Comando: npm run seed:services
 */

async function seedServices() {
  try {
    console.log('🌱 Iniciando seed de servicios...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Buscar o crear usuario de prueba
    let testUser = await User.findOne({ email: 'dev@jappi.ca' });

    if (!testUser) {
      console.log('⚠️  Usuario de prueba no encontrado, creando uno nuevo...');
      testUser = await User.create({
        email: 'dev@jappi.ca',
        password: 'Password123',
        preferredName: 'Dev User',
        firstName: 'Development',
        lastName: 'User',
        city: 'Toronto',
        isEmailVerified: true,
      });
      console.log('✅ Usuario de prueba creado\n');
    } else {
      console.log(`✅ Usuario encontrado: ${testUser.email}\n`);
    }

    // Eliminar servicios existentes (comentar si no quieres eliminar)
    await Service.deleteMany({});
    console.log('🗑️  Servicios existentes eliminados\n');

    // Array de servicios de ejemplo
    const services = [
      // ========================================
      // SALUD (4 servicios)
      // ========================================
      {
        name: 'Dra. Ana Martínez - Medicina Familiar',
        serviceType: 'Salud',
        description: 'Médica familiar con 15 años de experiencia atendiendo a familias latinas. Consultas en español, atención preventiva, manejo de enfermedades crónicas, medicina familiar integral. Especialista en salud de la mujer y pediatría.',
        credentials: 'MD, CCFP, 15+ años de experiencia',
        phone: '+1 (416) 555-0800',
        email: 'dra.martinez@healthlatina.ca',
        whatsapp: '+14165550800',
        city: 'Toronto',
        address: '123 Medical Plaza, Suite 200, Toronto, ON M5H 2N2',
        website: 'https://dra-martinez.com',
        instagram: '@dra.martinez.md',
        facebook: 'https://facebook.com/dra.martinez.familiar',
        linkedin: 'https://linkedin.com/in/ana-martinez-md',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 456,
        contactClicks: 92,
      },
      {
        name: 'Psicóloga María Elena Rodríguez',
        serviceType: 'Salud',
        description: 'Psicóloga clínica especializada en terapia para inmigrantes y familias latinas. Tratamiento de ansiedad, depresión, estrés migratorio, terapia de pareja y familiar. Sesiones presenciales y virtuales en español.',
        credentials: 'PhD en Psicología, Certificada en Terapia Cognitivo-Conductual',
        phone: '+1 (604) 555-0801',
        email: 'maria@psicologialatina.ca',
        whatsapp: '+16045550801',
        city: 'Vancouver',
        address: '456 Wellness Center, Vancouver, BC V6B 1A1',
        website: 'https://psicologialatina.ca',
        instagram: '@psicologa.maria',
        linkedin: 'https://linkedin.com/in/maria-rodriguez-psic',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 389,
        contactClicks: 78,
      },
      {
        name: 'Dr. Carlos Mendoza - Odontología',
        serviceType: 'Salud',
        description: 'Odontólogo general y cosmético. Limpiezas, blanqueamientos, implantes, ortodoncia y tratamiento de conducto. Planes de pago flexibles y atención en español. Tecnología moderna y ambiente acogedor.',
        credentials: 'DDS, 12 años de experiencia',
        phone: '+1 (514) 555-0802',
        email: 'dr.mendoza@dentalcare.ca',
        city: 'Montreal',
        address: '789 Dental Plaza, Montreal, QC H2Y 1C6',
        website: 'https://drcarlosmendoza.ca',
        instagram: '@dr.mendoza.dental',
        facebook: 'https://facebook.com/drcarlosmendoza',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 312,
        contactClicks: 63,
      },
      {
        name: 'Nutricionista Laura Fernández',
        serviceType: 'Salud',
        description: 'Nutricionista certificada especializada en nutrición familiar y planes personalizados. Control de peso, diabetes, hipertensión, alimentación infantil. Consultas virtuales disponibles. Recetas saludables y seguimiento continuo.',
        credentials: 'RD, Nutricionista Registrada',
        phone: '+1 (403) 555-0803',
        email: 'laura@nutricionlatina.ca',
        whatsapp: '+14035550803',
        city: 'Calgary',
        address: 'Consultas virtuales y a domicilio',
        website: 'https://nutricionlatina.ca',
        instagram: '@nutricionista.laura',
        owner: testUser._id,
        isActive: true,
        views: 267,
        contactClicks: 54,
      },

      // ========================================
      // LEGAL (3 servicios)
      // ========================================
      {
        name: 'Abogada Patricia Gómez - Inmigración',
        serviceType: 'Legal',
        description: 'Abogada especializada en derecho de inmigración canadiense. Permisos de trabajo, residencia permanente, sponsorship familiar, ciudadanía, refugio. Más de 10 años ayudando a la comunidad latina. Primera consulta gratis.',
        credentials: 'Abogada licenciada en Ontario, miembro del ICCRC',
        phone: '+1 (416) 555-0900',
        email: 'patricia@inmigracionlatina.ca',
        whatsapp: '+14165550900',
        city: 'Toronto',
        address: '234 Immigration Law Office, Toronto, ON M5J 2S1',
        website: 'https://inmigracionlatina.ca',
        instagram: '@abogada.patricia',
        facebook: 'https://facebook.com/abogadapatriciagomez',
        linkedin: 'https://linkedin.com/in/patricia-gomez-lawyer',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 678,
        contactClicks: 136,
      },
      {
        name: 'Bufete Legal Ramírez & Asociados',
        serviceType: 'Legal',
        description: 'Servicios legales integrales: derecho familiar (divorcio, custodia), derecho laboral, accidentes de tráfico, testamentos. Equipo bilingüe español-inglés. Consulta inicial gratuita. Planes de pago accesibles.',
        credentials: 'Bufete establecido desde 2010',
        phone: '+1 (604) 555-0901',
        email: 'info@ramirezlaw.ca',
        city: 'Vancouver',
        address: '567 Legal Plaza, Suite 400, Vancouver, BC V6E 2M6',
        website: 'https://ramirezlaw.ca',
        instagram: '@ramirezlaw',
        facebook: 'https://facebook.com/ramirezlawfirm',
        linkedin: 'https://linkedin.com/company/ramirez-law',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 445,
        contactClicks: 89,
      },
      {
        name: 'Notario Público Juan Silva',
        serviceType: 'Legal',
        description: 'Servicios notariales: certificación de documentos, poderes notariales, declaraciones juradas, autenticación de firmas. Traducción oficial de documentos. Atención rápida y profesional en español.',
        credentials: 'Notario Público certificado',
        phone: '+1 (514) 555-0902',
        email: 'juan@notariosilva.ca',
        city: 'Montreal',
        address: '890 Notary Services, Montreal, QC H3B 4W8',
        website: 'https://notariosilva.ca',
        owner: testUser._id,
        isActive: true,
        views: 298,
        contactClicks: 60,
      },

      // ========================================
      // FINANCIERO (3 servicios)
      // ========================================
      {
        name: 'Contador Roberto Vargas CPA',
        serviceType: 'Financiero',
        description: 'Servicios de contabilidad e impuestos para individuos y pequeñas empresas. Tax returns personales y corporativos, planificación fiscal, incorporación de negocios, bookkeeping. Maximiza tus devoluciones de impuestos.',
        credentials: 'CPA, CA, 18 años de experiencia',
        phone: '+1 (403) 555-0950',
        email: 'roberto@vargascpa.ca',
        whatsapp: '+14035550950',
        city: 'Calgary',
        address: '123 Accounting Plaza, Calgary, AB T2P 2M5',
        website: 'https://vargascpa.ca',
        instagram: '@vargascpa',
        linkedin: 'https://linkedin.com/in/roberto-vargas-cpa',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 389,
        contactClicks: 78,
      },
      {
        name: 'Asesora Financiera Carmen Torres',
        serviceType: 'Financiero',
        description: 'Planificación financiera personal: inversiones, RRSP, TFSA, RESP, seguros de vida, planificación de retiro. Ayudo a familias latinas a alcanzar sus metas financieras. Consulta inicial gratuita.',
        credentials: 'CFP, Certified Financial Planner',
        phone: '+1 (416) 555-0951',
        email: 'carmen@finanzaslatinas.ca',
        city: 'Toronto',
        address: 'Consultas virtuales y presenciales',
        website: 'https://finanzaslatinas.ca',
        instagram: '@asesora.carmen',
        facebook: 'https://facebook.com/carmentorresfinancial',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 412,
        contactClicks: 82,
      },
      {
        name: 'Mortgage Broker Latina',
        serviceType: 'Financiero',
        description: 'Especialistas en hipotecas para la comunidad latina. Primera vivienda, refinanciamiento, renovación de hipoteca. Acceso a más de 30 instituciones financieras. Pre-aprobaciones rápidas. Servicio en español.',
        credentials: 'Brokers licenciados en BC',
        phone: '+1 (604) 555-0952',
        email: 'info@mortgagelatina.ca',
        whatsapp: '+16045550952',
        city: 'Vancouver',
        address: '456 Mortgage Center, Vancouver, BC V6C 3E1',
        website: 'https://mortgagelatina.ca',
        instagram: '@mortgagelatina',
        owner: testUser._id,
        isActive: true,
        views: 356,
        contactClicks: 71,
      },

      // ========================================
      // TRADUCCIÓN (2 servicios)
      // ========================================
      {
        name: 'Servicios de Traducción Profesional',
        serviceType: 'Traducción',
        description: 'Traducción certificada y profesional español-inglés-francés. Documentos legales, médicos, académicos, comerciales, personales. Traducción e interpretación simultánea. Certificación oficial reconocida por IRCC. Entrega rápida.',
        credentials: 'Traductores certificados ATIO y STIBC',
        phone: '+1 (514) 555-1000',
        email: 'traducciones@prolatina.ca',
        city: 'Montreal',
        address: '234 Translation Services, Montreal, QC H2X 3Y8',
        website: 'https://traduccionprolatina.ca',
        instagram: '@traduccion.prolatina',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 445,
        contactClicks: 89,
      },
      {
        name: 'Intérprete Médico Certificado',
        serviceType: 'Traducción',
        description: 'Interpretación médica especializada para citas, cirugías, emergencias. Disponible 24/7 para hospitales y clínicas. Interpretación telefónica y presencial. Confidencialidad absoluta. Ayudamos a comunicarte con tu doctor.',
        credentials: 'Intérprete médico certificado, 8 años de experiencia',
        phone: '+1 (416) 555-1001',
        email: 'interprete@medicallatino.ca',
        whatsapp: '+14165551001',
        city: 'Toronto',
        address: 'Servicio móvil en todo GTA',
        website: 'https://interpretemedico.ca',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 312,
        contactClicks: 62,
      },

      // ========================================
      // EDUCACIÓN (2 servicios)
      // ========================================
      {
        name: 'Academia de Español para Niños',
        serviceType: 'Educación',
        description: 'Clases de español para niños y jóvenes. Mantenemos vivo el idioma en segunda generación. Grupos por edad, clases dinámicas, actividades culturales. Profesores nativos certificados. Clases presenciales y online.',
        credentials: 'Profesores certificados en enseñanza de español como lengua de herencia',
        phone: '+1 (604) 555-1100',
        email: 'info@academiaespanol.ca',
        whatsapp: '+16045551100',
        city: 'Vancouver',
        address: '789 Learning Center, Vancouver, BC V5K 0A1',
        website: 'https://academiaespanol.ca',
        instagram: '@academia.espanol.kids',
        facebook: 'https://facebook.com/academiaespanolkids',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 278,
        contactClicks: 56,
      },
      {
        name: 'Tutorías Académicas Personalizadas',
        serviceType: 'Educación',
        description: 'Tutorías para estudiantes de primaria, secundaria y universidad. Matemáticas, ciencias, inglés, francés. Preparación para exámenes y tareas. Refuerzo académico personalizado. Clases presenciales y online en español.',
        credentials: 'Tutores universitarios certificados',
        phone: '+1 (403) 555-1101',
        email: 'tutorias@edulatina.ca',
        city: 'Calgary',
        address: 'Clases a domicilio y virtuales',
        website: 'https://tutoriaslatinas.ca',
        instagram: '@tutorias.latinas',
        owner: testUser._id,
        isActive: true,
        views: 234,
        contactClicks: 47,
      },

      // ========================================
      // INMIGRACIÓN (2 servicios)
      // ========================================
      {
        name: 'Consultoría de Inmigración Express Entry',
        serviceType: 'Inmigración',
        description: 'Especialistas en Express Entry y programas provinciales (PNP). Evaluación de perfil, mejora de puntaje CRS, preparación de documentos, seguimiento de aplicación. Tasa de éxito del 95%. Consulta inicial gratis.',
        credentials: 'RCIC - Consultores Regulados de Inmigración Canadiense',
        phone: '+1 (416) 555-1200',
        email: 'consulta@expressentrylatino.ca',
        whatsapp: '+14165551200',
        city: 'Toronto',
        address: '567 Immigration Hub, Toronto, ON M5V 3A8',
        website: 'https://expressentrylatino.ca',
        instagram: '@expressentry.latino',
        facebook: 'https://facebook.com/expressentrylatino',
        linkedin: 'https://linkedin.com/company/expressentry-latino',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 589,
        contactClicks: 118,
      },
      {
        name: 'Asesoría en Sponsorship Familiar',
        serviceType: 'Inmigración',
        description: 'Especialistas en reunificación familiar: sponsorship de esposos, hijos, padres y abuelos. Preparamos tu aplicación completa con toda la documentación. Proceso transparente y apoyo continuo. Español e inglés.',
        credentials: 'RCIC licenciados, 12 años ayudando familias',
        phone: '+1 (604) 555-1201',
        email: 'familia@reunificacionlatina.ca',
        city: 'Vancouver',
        address: '890 Family Immigration, Vancouver, BC V6Z 2E8',
        website: 'https://reunificacionlatina.ca',
        instagram: '@sponsorship.familiar',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 467,
        contactClicks: 93,
      },

      // ========================================
      // TECNOLOGÍA (2 servicios)
      // ========================================
      {
        name: 'Desarrollador Web Freelance',
        serviceType: 'Tecnología',
        description: 'Desarrollo de sitios web profesionales y tiendas online. WordPress, Shopify, diseño personalizado, SEO, mantenimiento. Ayudo a emprendedores latinos a tener presencia digital. Precios accesibles y planes de pago.',
        credentials: 'Full Stack Developer, 10 años de experiencia',
        phone: '+1 (514) 555-1300',
        email: 'dev@weblatinotech.ca',
        whatsapp: '+15145551300',
        city: 'Montreal',
        address: 'Trabajo remoto',
        website: 'https://weblatinotech.ca',
        instagram: '@weblatino.tech',
        linkedin: 'https://linkedin.com/in/weblatino-dev',
        owner: testUser._id,
        isActive: true,
        views: 298,
        contactClicks: 60,
      },
      {
        name: 'Soporte Técnico IT en Español',
        serviceType: 'Tecnología',
        description: 'Soporte técnico para computadoras, laptops, impresoras, redes WiFi. Reparación, instalación de software, eliminación de virus, configuración de correo. Servicio a domicilio en GTA. Atención en español las 24/7.',
        credentials: 'Técnico certificado CompTIA A+',
        phone: '+1 (416) 555-1301',
        email: 'soporte@itlatino.ca',
        city: 'Toronto',
        address: 'Servicio a domicilio GTA',
        website: 'https://soporteitlatino.ca',
        instagram: '@soporte.itlatino',
        owner: testUser._id,
        isActive: true,
        views: 267,
        contactClicks: 53,
      },

      // ========================================
      // CONSULTORÍA (2 servicios)
      // ========================================
      {
        name: 'Consultoría de Negocios Startups',
        serviceType: 'Consultoría',
        description: 'Ayudamos a emprendedores latinos a iniciar su negocio en Canadá. Plan de negocios, incorporación, marketing digital, finanzas, permisos. Mentoría personalizada. Workshops grupales. Español e inglés.',
        credentials: 'MBA, 15 años de experiencia empresarial',
        phone: '+1 (403) 555-1400',
        email: 'emprendedor@bizlatino.ca',
        whatsapp: '+14035551400',
        city: 'Calgary',
        address: '123 Business Hub, Calgary, AB T2G 4V1',
        website: 'https://consultoriabizlatino.ca',
        instagram: '@biz.latino',
        facebook: 'https://facebook.com/bizlatino',
        linkedin: 'https://linkedin.com/company/bizlatino',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 356,
        contactClicks: 71,
      },
      {
        name: 'Coach de Vida y Carrera Profesional',
        serviceType: 'Consultoría',
        description: 'Coaching para desarrollo profesional y personal. Te ayudo a alcanzar tus metas, encontrar trabajo en Canadá, transición de carrera, equilibrio vida-trabajo. Sesiones individuales y grupales en español.',
        credentials: 'Certified Life & Career Coach (ICF)',
        phone: '+1 (604) 555-1401',
        email: 'coach@vidaycarrera.ca',
        city: 'Vancouver',
        address: 'Sesiones virtuales y presenciales',
        website: 'https://coachinglatino.ca',
        instagram: '@coach.vidaycarrera',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 423,
        contactClicks: 85,
      },
    ];

    // Insertar servicios en la base de datos
    console.log('📝 Insertando servicios...');
    const insertedServices = await Service.insertMany(services);
    console.log(`✅ ${insertedServices.length} servicios creados exitosamente\n`);

    // Estadísticas por tipo de servicio
    const stats = await Service.aggregate([
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log('📊 Resumen por tipo de servicio:');
    stats.forEach((stat) => {
      console.log(`   - ${stat._id}: ${stat.count} servicios`);
    });

    // Estadísticas por ciudad
    const cityStats = await Service.aggregate([
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    console.log('\n📍 Resumen por ciudad:');
    cityStats.forEach((stat) => {
      console.log(`   - ${stat._id}: ${stat.count} servicios`);
    });

    // Estadísticas generales
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const verifiedServices = await Service.countDocuments({ isVerified: true });
    const featuredServices = await Service.countDocuments({ isFeatured: true });

    console.log('\n📈 Estadísticas generales:');
    console.log(`   - Total: ${totalServices}`);
    console.log(`   - Activos: ${activeServices}`);
    console.log(`   - Verificados: ${verifiedServices}`);
    console.log(`   - Destacados: ${featuredServices}`);

    console.log('\n✅ SEED DE SERVICIOS COMPLETADO EXITOSAMENTE ✅\n');
  } catch (error) {
    console.error('❌ Error en seed de servicios:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Desconectado de MongoDB');
    process.exit(0);
  }
}

// Ejecutar seed
seedServices();
