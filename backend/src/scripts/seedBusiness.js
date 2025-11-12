import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Business from '../models/Business.js';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Seed Script para Business - Entre Amigas
 * Crea negocios de ejemplo en la base de datos
 */

const seedBusinesses = async () => {
  try {
    console.log('\n🌱 Iniciando seed de negocios...\n');

    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 2. Buscar o crear usuario de prueba (owner de los negocios)
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
      });
      console.log(`✅ Usuario creado: ${testUser.email}\n`);
    } else {
      console.log(`✅ Usuario encontrado: ${testUser.email}\n`);
    }

    // 3. Limpiar negocios existentes (opcional - comentar si no quieres eliminar)
    const deleteCount = await Business.countDocuments();
    if (deleteCount > 0) {
      console.log(`🗑️  Eliminando ${deleteCount} negocios existentes...`);
      await Business.deleteMany({});
      console.log('✅ Negocios anteriores eliminados\n');
    }

    // 4. Definir negocios de ejemplo
    const businesses = [
      // ========================================
      // GASTRONOMÍA (8 negocios)
      // ========================================
      {
        name: 'La Cocina de María',
        category: 'Gastronomía',
        description: 'Restaurante familiar que ofrece auténtica comida colombiana. Especializados en bandeja paisa, arepas, sancocho y tamales. Ambiente acogedor y precios accesibles. Disponible para eventos y catering.',
        phone: '+1 (416) 555-0100',
        email: 'info@cocinamaria.com',
        whatsapp: '+14165550100',
        city: 'Toronto',
        address: '2345 Bloor St W, Toronto, ON M6S 1P2',
        website: 'https://lacocinamaria.com',
        instagram: '@lacocinamaria',
        facebook: 'https://facebook.com/lacocinamaria',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 234,
        contactClicks: 45,
      },
      {
        name: 'Empanadas del Sur',
        category: 'Gastronomía',
        description: 'Empanadas argentinas y chilenas hechas a mano con recetas tradicionales. Variedad de rellenos: carne, pollo, humita, caprese y más. Servicio de delivery y catering para eventos. Masa casera crujiente y rellenos generosos.',
        phone: '+1 (604) 555-0101',
        email: 'pedidos@empanadasdelsur.ca',
        whatsapp: '+16045550101',
        city: 'Vancouver',
        address: '1234 Commercial Dr, Vancouver, BC V5L 3X9',
        website: 'https://empanadasdelsur.ca',
        instagram: '@empanadasdelsur',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 189,
        contactClicks: 38,
      },
      {
        name: 'Cafetería Alma Latina',
        category: 'Gastronomía',
        description: 'Café especializado con café de origen latinoamericano. Ofrecemos desayunos y almuerzos caseros, postres tradicionales y café de Colombia, Costa Rica y Guatemala. Ambiente familiar y WiFi gratis.',
        phone: '+1 (514) 555-0102',
        email: 'hola@almalatina.cafe',
        city: 'Montreal',
        address: '567 St-Laurent Blvd, Montreal, QC H2Y 2Y7',
        website: 'https://almalatina.cafe',
        instagram: '@almalatinamtl',
        facebook: 'https://facebook.com/almalatinamontreal',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 312,
        contactClicks: 67,
      },
      {
        name: 'Sabor Venezolano',
        category: 'Gastronomía',
        description: 'Food truck de comida venezolana. Arepas, tequeños, cachapas y patacones frescos todos los días. Ubicados en eventos y festivales de la ciudad. Síguenos en redes para saber nuestra ubicación diaria.',
        phone: '+1 (403) 555-0103',
        email: 'sabor@venezolano.ca',
        whatsapp: '+14035550103',
        city: 'Calgary',
        address: 'Food Truck - Ver ubicación en Instagram',
        instagram: '@saborvenezuelanoyyz',
        facebook: 'https://facebook.com/saborvenezuelano',
        owner: testUser._id,
        isActive: true,
        views: 156,
        contactClicks: 28,
      },
      {
        name: 'Panadería La Estrella',
        category: 'Gastronomía',
        description: 'Panadería artesanal con pan dulce mexicano, conchas, orejas, cuernitos y pan de muerto en temporada. También ofrecemos pasteles personalizados para toda ocasión. Horneado fresco diario desde las 6am.',
        phone: '+1 (416) 555-0104',
        email: 'pedidos@panaderialaestrella.com',
        city: 'Toronto',
        address: '890 Dundas St W, Toronto, ON M6J 1V9',
        website: 'https://panaderialaestrella.com',
        instagram: '@panaderialaestrella',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 201,
        contactClicks: 42,
      },
      {
        name: 'Cevichería Peruana',
        category: 'Gastronomía',
        description: 'Auténtico ceviche peruano y comida marina. Ceviche clásico, ceviche mixto, tiradito, arroz con mariscos y más. Pescado fresco diario. Ambiente casual y familiar. Pisco sours y chilcanos disponibles.',
        phone: '+1 (604) 555-0105',
        email: 'info@cevicheriaperuana.ca',
        whatsapp: '+16045550105',
        city: 'Vancouver',
        address: '456 Davie St, Vancouver, BC V6B 2G1',
        website: 'https://cevicheriaperuana.ca',
        instagram: '@cevicheriaperuana',
        facebook: 'https://facebook.com/cevicheriaperuana',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 278,
        contactClicks: 56,
      },
      {
        name: 'Tacos Don Pedro',
        category: 'Gastronomía',
        description: 'Tacos mexicanos al estilo Guadalajara. Tacos al pastor, carnitas, barbacoa, pescado y vegetarianos. Tortillas hechas a mano, salsas caseras. Servicio de catering para fiestas y eventos corporativos.',
        phone: '+1 (514) 555-0106',
        email: 'tacos@donpedro.ca',
        city: 'Montreal',
        address: '234 Jean-Talon W, Montreal, QC H2R 2X4',
        instagram: '@tacosdonpedro',
        owner: testUser._id,
        isActive: true,
        views: 145,
        contactClicks: 31,
      },
      {
        name: 'Dulcería Mexicana',
        category: 'Gastronomía',
        description: 'Dulces típicos mexicanos importados y hechos en casa. Mazapanes, obleas, paletas, chamoy, tamarindos y más. También vendemos ingredientes y especias para cocina mexicana. Envíos a toda la provincia.',
        phone: '+1 (403) 555-0107',
        email: 'ventas@dulceriamexicana.ca',
        whatsapp: '+14035550107',
        city: 'Calgary',
        address: '789 17th Ave SW, Calgary, AB T2S 0A9',
        website: 'https://dulceriamexicana.ca',
        instagram: '@dulceriamx',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 167,
        contactClicks: 29,
      },

      // ========================================
      // BELLEZA Y BIENESTAR (6 negocios)
      // ========================================
      {
        name: 'Salón de Belleza Gabriela',
        category: 'Belleza y Bienestar',
        description: 'Salón de belleza especializado en cortes, color, tratamientos capilares, keratina brasileña y alisados. Manicure, pedicure y diseño de cejas. Atención personalizada con productos profesionales. Citas los 7 días.',
        phone: '+1 (416) 555-0200',
        email: 'citas@salongabriela.com',
        whatsapp: '+14165550200',
        city: 'Toronto',
        address: '1567 Queen St E, Toronto, ON M4L 1E7',
        website: 'https://salongabriela.com',
        instagram: '@salongabriela',
        facebook: 'https://facebook.com/salongabriela',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 423,
        contactClicks: 89,
      },
      {
        name: 'Spa Relajante',
        category: 'Belleza y Bienestar',
        description: 'Spa y masajes terapéuticos. Masaje relajante, descontracturante, deportivo, prenatal y con piedras calientes. Reflexología y aromaterapia. Ambiente tranquilo y profesional. Paquetes y membresías disponibles.',
        phone: '+1 (604) 555-0201',
        email: 'reservas@sparelajante.ca',
        city: 'Vancouver',
        address: '890 Robson St, Vancouver, BC V6Z 2E7',
        website: 'https://sparelajante.ca',
        instagram: '@sparelajante',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 298,
        contactClicks: 61,
      },
      {
        name: 'Estética Latina',
        category: 'Belleza y Bienestar',
        description: 'Centro de estética integral. Limpieza facial, tratamientos anti-edad, depilación láser, microblading de cejas y pestañas. Masajes reductivos y drenaje linfático. Productos naturales y tecnología avanzada.',
        phone: '+1 (514) 555-0202',
        email: 'info@estelatina.ca',
        whatsapp: '+15145550202',
        city: 'Montreal',
        address: '345 Sherbrooke St W, Montreal, QC H3A 1B3',
        website: 'https://estelatina.ca',
        instagram: '@estelatina',
        facebook: 'https://facebook.com/estelatina',
        owner: testUser._id,
        isActive: true,
        views: 234,
        contactClicks: 48,
      },
      {
        name: 'Barbería El Caballero',
        category: 'Belleza y Bienestar',
        description: 'Barbería tradicional para hombres. Cortes clásicos y modernos, afeitado con navaja, arreglo de barba y bigote. Ambiente masculino y relajado. Productos premium de barbería. Sin cita o con reserva.',
        phone: '+1 (403) 555-0203',
        email: 'barber@elcaballero.ca',
        city: 'Calgary',
        address: '456 10th Ave SW, Calgary, AB T2R 0A5',
        instagram: '@barberiaelcaballero',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 178,
        contactClicks: 34,
      },
      {
        name: 'Nails & Beauty Studio',
        category: 'Belleza y Bienestar',
        description: 'Estudio de uñas y pestañas. Manicure, pedicure, uñas acrílicas, gel, diseños y nail art. Extensiones de pestañas clásicas, volumen y mega volumen. Ambiente limpio y esterilizado. Citas disponibles.',
        phone: '+1 (416) 555-0204',
        email: 'book@nailsbeauty.ca',
        whatsapp: '+14165550204',
        city: 'Toronto',
        address: '678 Yonge St, Toronto, ON M4Y 2A6',
        website: 'https://nailsbeauty.ca',
        instagram: '@nailsbeautystudio',
        owner: testUser._id,
        isActive: true,
        views: 312,
        contactClicks: 67,
      },
      {
        name: 'Centro de Yoga Namaste',
        category: 'Belleza y Bienestar',
        description: 'Clases de yoga, meditación y pilates. Yoga para principiantes, intermedio y avanzado. Yoga prenatal y restaurativo. Meditación guiada y mindfulness. Clases grupales y privadas. Paquetes mensuales.',
        phone: '+1 (604) 555-0205',
        email: 'clases@yoganamaste.ca',
        city: 'Vancouver',
        address: '234 Main St, Vancouver, BC V5T 3E5',
        website: 'https://yoganamaste.ca',
        instagram: '@yoganamastevan',
        facebook: 'https://facebook.com/yoganamaste',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 267,
        contactClicks: 53,
      },

      // ========================================
      // MODA Y ACCESORIOS (4 negocios)
      // ========================================
      {
        name: 'Boutique Latina',
        category: 'Moda y Accesorios',
        description: 'Ropa femenina de moda, vestidos, blusas, pantalones y accesorios. Estilo latino moderno y elegante. Tallas variadas del XS al XXL. Nueva colección cada temporada. Envío gratis en compras mayores a $100.',
        phone: '+1 (514) 555-0300',
        email: 'tienda@boutiquelatina.ca',
        whatsapp: '+15145550300',
        city: 'Montreal',
        address: '567 Mont-Royal Ave E, Montreal, QC H2J 1W5',
        website: 'https://boutiquelatina.ca',
        instagram: '@boutiquelatina',
        facebook: 'https://facebook.com/boutiquelatina',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 389,
        contactClicks: 78,
      },
      {
        name: 'Joyería Artesanal',
        category: 'Moda y Accesorios',
        description: 'Joyería artesanal hecha a mano. Aretes, collares, pulseras y anillos únicos. Materiales naturales, plata 925 y piedras semi-preciosas. Diseños personalizados para ocasiones especiales. Regalos perfectos.',
        phone: '+1 (403) 555-0301',
        email: 'ventas@joyeriaartesanal.ca',
        city: 'Calgary',
        address: '890 Kensington Rd NW, Calgary, AB T2N 3P4',
        website: 'https://joyeriaartesanal.ca',
        instagram: '@joyeriaartesanal',
        owner: testUser._id,
        isActive: true,
        views: 223,
        contactClicks: 44,
      },
      {
        name: 'Zapatería El Paso',
        category: 'Moda y Accesorios',
        description: 'Calzado para toda la familia. Zapatos casuales, deportivos, formales y botas. Marcas reconocidas y precios accesibles. Tallas especiales disponibles. Reparación de calzado y servicio personalizado.',
        phone: '+1 (416) 555-0302',
        email: 'info@zapateriaelpaso.ca',
        city: 'Toronto',
        address: '1234 College St, Toronto, ON M6H 1C3',
        instagram: '@zapateriaelpaso',
        facebook: 'https://facebook.com/zapateriaelpaso',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 198,
        contactClicks: 39,
      },
      {
        name: 'Accesorios Chic',
        category: 'Moda y Accesorios',
        description: 'Bolsos, carteras, cinturones, bufandas y accesorios de moda. Estilo actual y atemporal. Materiales de calidad a precios justos. Perfecto para regalos. Descuentos especiales en Black Friday y temporadas.',
        phone: '+1 (604) 555-0303',
        email: 'ventas@accesorioschic.ca',
        whatsapp: '+16045550303',
        city: 'Vancouver',
        address: '456 Granville St, Vancouver, BC V6C 1V1',
        website: 'https://accesorioschic.ca',
        instagram: '@accesorioschic',
        owner: testUser._id,
        isActive: true,
        views: 256,
        contactClicks: 51,
      },

      // ========================================
      // TRÁMITES, CONSULTORÍA Y FOTOGRAFÍA (5 negocios)
      // ========================================
      {
        name: 'Asesoría Legal Latina',
        category: 'Trámites y Gestorías',
        description: 'Servicios legales en español para inmigrantes. Asesoría en inmigración, permisos de trabajo, residencia permanente, ciudadanía. También derecho familiar, laboral y de negocios. Primera consulta gratis.',
        phone: '+1 (416) 555-0400',
        email: 'contacto@asesorialatina.ca',
        city: 'Toronto',
        address: '789 Bay St Suite 1200, Toronto, ON M5G 2N8',
        website: 'https://asesorialatina.ca',
        instagram: '@asesorialatina',
        facebook: 'https://facebook.com/asesorialatina',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 445,
        contactClicks: 92,
      },
      {
        name: 'Contabilidad y Tax',
        category: 'Consultoría',
        description: 'Servicios de contabilidad, impuestos y finanzas para individuos y pequeñas empresas. Preparación de tax returns, incorporación de negocios, nómina y bookkeeping. Atención en español. Precios competitivos.',
        phone: '+1 (604) 555-0401',
        email: 'info@contabilidadtax.ca',
        whatsapp: '+16045550401',
        city: 'Vancouver',
        address: '234 Burrard St Suite 500, Vancouver, BC V6C 2K1',
        website: 'https://contabilidadtax.ca',
        instagram: '@contabilidadtax',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 367,
        contactClicks: 74,
      },
      {
        name: 'Agencia de Traducciones',
        category: 'Trámites y Gestorías',
        description: 'Traducciones certificadas y profesionales español-inglés-francés. Documentos legales, médicos, académicos, comerciales. Traducción e interpretación simultánea. Servicio rápido y confiable. Precios por palabra.',
        phone: '+1 (514) 555-0402',
        email: 'traducciones@agencialatina.ca',
        city: 'Montreal',
        address: '567 René-Lévesque Blvd W, Montreal, QC H2Z 1A6',
        website: 'https://traduccioneslatina.ca',
        instagram: '@traduccioneslatina',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 289,
        contactClicks: 58,
      },
      {
        name: 'Consultoría de Negocios',
        category: 'Consultoría',
        description: 'Asesoría para emprendedores y pequeñas empresas. Plan de negocios, estrategia de marketing, finanzas, branding. Ayudamos a hacer crecer tu negocio. Sesiones individuales o grupales. Talleres mensuales.',
        phone: '+1 (403) 555-0403',
        email: 'consultoria@bizlatina.ca',
        whatsapp: '+14035550403',
        city: 'Calgary',
        address: '890 7th Ave SW Suite 300, Calgary, AB T2P 3P7',
        website: 'https://bizlatina.ca',
        instagram: '@bizlatina',
        facebook: 'https://facebook.com/bizlatina',
        owner: testUser._id,
        isActive: true,
        views: 312,
        contactClicks: 63,
      },
      {
        name: 'Fotografía Profesional',
        category: 'Fotografía y Video',
        description: 'Fotografía para eventos, bodas, quinceañeras, bautizos, retratos familiares y corporativos. Sesiones en estudio o exteriores. Video y edición profesional. Paquetes personalizados. Álbumes digitales e impresos.',
        phone: '+1 (416) 555-0404',
        email: 'fotos@fotoslatina.ca',
        city: 'Toronto',
        address: 'Estudio móvil - Servicio a domicilio',
        website: 'https://fotoslatina.ca',
        instagram: '@fotoslatinato',
        facebook: 'https://facebook.com/fotoslatina',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        isFeatured: true,
        views: 478,
        contactClicks: 96,
      },

      // ========================================
      // EDUCACIÓN Y TUTORÍAS (3 negocios)
      // ========================================
      {
        name: 'Academia de Español',
        category: 'Educación y Tutorías',
        description: 'Clases de español para todas las edades y niveles. Español conversacional, gramática, preparación para exámenes DELE. Clases privadas, grupales y online. Profesores nativos certificados. Precios accesibles.',
        phone: '+1 (604) 555-0500',
        email: 'clases@academiaespanol.ca',
        whatsapp: '+16045550500',
        city: 'Vancouver',
        address: '345 Hastings St W, Vancouver, BC V6B 1L5',
        website: 'https://academiaespanol.ca',
        instagram: '@academiaespanol',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 234,
        contactClicks: 47,
      },
      {
        name: 'Clases de Música',
        category: 'Educación y Tutorías',
        description: 'Clases de guitarra, piano, canto y percusión latina. Para niños, jóvenes y adultos. Música clásica, popular y latina. Profesores experimentados. Preparación para exámenes RCM. Recitales anuales.',
        phone: '+1 (514) 555-0501',
        email: 'musica@claseslatinas.ca',
        city: 'Montreal',
        address: '678 Parc Ave, Montreal, QC H2V 4E8',
        website: 'https://musicalatina.ca',
        instagram: '@musicalatina',
        facebook: 'https://facebook.com/musicalatina',
        owner: testUser._id,
        isActive: true,
        views: 198,
        contactClicks: 39,
      },
      {
        name: 'Tutorías Académicas',
        category: 'Educación y Tutorías',
        description: 'Tutorías personalizadas para estudiantes de primaria, secundaria y universidad. Matemáticas, ciencias, inglés, francés y español. Ayuda con tareas y preparación de exámenes. Clases presenciales y online.',
        phone: '+1 (403) 555-0502',
        email: 'tutorias@aprendelatino.ca',
        whatsapp: '+14035550502',
        city: 'Calgary',
        address: 'Servicio a domicilio y online',
        website: 'https://aprendelatino.ca',
        instagram: '@aprendelatino',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 267,
        contactClicks: 54,
      },

      // ========================================
      // SERVICIOS DEL HOGAR (4 negocios adicionales)
      // ========================================
      {
        name: 'Limpieza Profesional',
        category: 'Servicios del Hogar',
        description: 'Servicio de limpieza residencial y comercial. Limpieza profunda, mantenimiento regular, limpieza de mudanza y post-construcción. Personal capacitado, productos ecológicos. Presupuesto gratis. Servicio confiable.',
        phone: '+1 (416) 555-0600',
        email: 'servicios@limpiezalatina.ca',
        whatsapp: '+14165550600',
        city: 'Toronto',
        address: 'Servicio a domicilio GTA',
        website: 'https://limpiezalatina.ca',
        instagram: '@limpiezalatina',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 345,
        contactClicks: 69,
      },
      {
        name: 'Reparaciones del Hogar',
        category: 'Servicios del Hogar',
        description: 'Servicios de plomería, electricidad, carpintería y pintura. Reparaciones menores y renovaciones. Instalación de electrodomésticos, cambio de llaves, reparación de drywall. Servicio rápido y garantizado.',
        phone: '+1 (604) 555-0601',
        email: 'reparaciones@handylatino.ca',
        city: 'Vancouver',
        address: 'Servicio a domicilio Metro Vancouver',
        instagram: '@handylatino',
        facebook: 'https://facebook.com/handylatino',
        owner: testUser._id,
        isActive: true,
        views: 289,
        contactClicks: 58,
      },
      {
        name: 'Jardinería y Paisajismo',
        category: 'Servicios del Hogar',
        description: 'Diseño de jardines, mantenimiento de áreas verdes, corte de pasto, poda de árboles y arbustos. Instalación de sistemas de riego. Limpieza de hojas en otoño. Servicio profesional y puntual.',
        phone: '+1 (514) 555-0602',
        email: 'jardines@verdelatino.ca',
        whatsapp: '+15145550602',
        city: 'Montreal',
        address: 'Servicio a domicilio Montreal y alrededores',
        website: 'https://verdelatino.ca',
        instagram: '@verdelatino',
        owner: testUser._id,
        isActive: true,
        views: 223,
        contactClicks: 45,
      },
      {
        name: 'Mudanzas Rápidas',
        category: 'Servicios del Hogar',
        description: 'Servicio de mudanzas residenciales y comerciales. Local y larga distancia. Empaque, carga, transporte y descarga. Camiones equipados y personal experimentado. Precios competitivos. Cotización gratuita.',
        phone: '+1 (403) 555-0603',
        email: 'mudanzas@movelatino.ca',
        city: 'Calgary',
        address: 'Servicio en Calgary y Alberta',
        website: 'https://movelatino.ca',
        instagram: '@movelatino',
        facebook: 'https://facebook.com/movelatino',
        owner: testUser._id,
        isActive: true,
        isVerified: true,
        views: 312,
        contactClicks: 63,
      },
    ];

    // 5. Insertar negocios en la base de datos
    console.log(`📝 Insertando ${businesses.length} negocios...`);
    const result = await Business.insertMany(businesses);
    console.log(`✅ ${result.length} negocios creados exitosamente\n`);

    // 6. Mostrar resumen por categoría
    const stats = await Business.getStats();
    console.log('📊 Resumen por categoría:');
    stats.byCategory.forEach((cat) => {
      console.log(`   - ${cat._id}: ${cat.count} negocios`);
    });
    console.log('\n');

    console.log('📊 Resumen por ciudad:');
    stats.byCity.forEach((city) => {
      console.log(`   - ${city._id}: ${city.count} negocios`);
    });
    console.log('\n');

    console.log('📈 Estadísticas generales:');
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Activos: ${stats.active}`);
    console.log(`   - Verificados: ${stats.verified}`);
    console.log(`   - Destacados: ${stats.featured}\n`);

    console.log('✅ SEED COMPLETADO EXITOSAMENTE ✅\n');
  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('👋 Conexión a MongoDB cerrada\n');
    process.exit(0);
  }
};

// Ejecutar seed
seedBusinesses();
