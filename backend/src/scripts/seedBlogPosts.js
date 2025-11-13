import dotenv from 'dotenv';
import mongoose from 'mongoose';
import BlogPost from '../models/BlogPost.js';
import User from '../models/User.js';

// Cargar variables de entorno
dotenv.config();

/**
 * Seed Script para BlogPosts - Entre Amigas
 * Crea artículos de ejemplo en español para el blog
 */

const seedBlogPosts = async () => {
  try {
    console.log('\n🌱 Iniciando seed de artículos del blog...\n');

    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    // 2. Buscar o crear usuario de prueba (autor de los artículos)
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

    // 3. Limpiar artículos existentes (opcional - comentar si no quieres eliminar)
    const deleteCount = await BlogPost.countDocuments();
    if (deleteCount > 0) {
      console.log(`🗑️  Eliminando ${deleteCount} artículos existentes...`);
      await BlogPost.deleteMany({});
      console.log('✅ Artículos anteriores eliminados\n');
    }

    // 4. Definir artículos de ejemplo
    const blogPosts = [
      // ========================================
      // WELLNESS
      // ========================================
      {
        title: '5 Prácticas de Autocuidado que Transformaron Mi Vida en Canadá',
        slug: '5-practicas-autocuidado-transformaron-mi-vida-canada',
        content: `
          <p>Cuando llegué a Canadá hace tres años, el frío, la distancia de mi familia y el choque cultural me afectaron más de lo que esperaba. Me sentía perdida, agotada y desconectada de mí misma. Fue entonces cuando descubrí el poder del autocuidado consciente.</p>

          <h2>1. Yoga Matutino: Mi Momento Sagrado</h2>
          <p>Empecé con solo 10 minutos al día. Ahora, mi práctica de yoga matutina es innegociable. Me ayuda a conectar con mi cuerpo, calmar mi mente y establecer intenciones positivas para el día. No necesitas ser flexible ni experta, solo estar presente contigo misma.</p>

          <h2>2. Journaling en Español: Honrando Mi Lengua Materna</h2>
          <p>Escribir en mi diario en español me ayuda a mantener mi identidad cultural mientras proceso emociones. Es terapéutico escribir sobre mis miedos, logros y sueños sin el filtro del inglés. Algunas cosas solo se pueden expresar en la lengua del corazón.</p>

          <h2>3. Baños Calientes con Sales de Epsom</h2>
          <p>Los inviernos canadienses son duros. Un baño caliente con sales de Epsom, aceites esenciales de lavanda y una vela se convirtió en mi ritual semanal de relajación. Es mi spa personal donde libero tensiones acumuladas.</p>

          <h2>4. Caminatas en la Naturaleza</h2>
          <p>Aunque al principio odiaba el frío, descubrí que caminar en parques durante todas las estaciones me conecta con mi nueva tierra. La naturaleza canadiense es impresionante, y caminar me ayuda a despejar la mente y reducir la ansiedad.</p>

          <h2>5. Círculos de Mujeres Virtuales</h2>
          <p>Unirme a grupos de mujeres latinas migrantes cambió todo. Compartir experiencias, llorar juntas, celebrar logros... El apoyo de otras mujeres que entienden tu proceso es sanador. No estamos solas en esto.</p>

          <h2>Conclusión</h2>
          <p>El autocuidado no es egoísta, es supervivencia. Como mujeres migrantes, enfrentamos desafíos únicos. Cuidarnos nos permite cuidar mejor a nuestras familias y comunidades. Te invito a experimentar con estas prácticas y descubrir qué funciona para ti.</p>
        `,
        excerpt: 'Descubre las prácticas de autocuidado que me ayudaron a navegar la migración y el frío canadiense. Desde yoga matutino hasta círculos de mujeres, aprende cómo cuidarte en tierra extranjera.',
        featuredImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        category: 'Wellness',
        tags: ['autocuidado', 'yoga', 'migración', 'salud mental', 'bienestar'],
        author: testUser._id,
        status: 'published',
        isFeatured: true,
        views: 342,
        metaDescription: 'Prácticas de autocuidado para mujeres migrantes en Canadá: yoga, journaling, baños relajantes y más.',
        metaKeywords: ['autocuidado', 'wellness', 'migración', 'canadá', 'latinas'],
      },

      // ========================================
      // AMISTAD
      // ========================================
      {
        title: 'Cómo Encontré a Mi Tribu en Toronto: Guía para Hacer Amigas Siendo Migrante',
        slug: 'como-encontre-mi-tribu-toronto-guia-hacer-amigas-migrante',
        content: `
          <p>Una de las partes más difíciles de migrar fue dejar atrás a mis amigas de toda la vida. Al llegar a Toronto, me sentí terriblemente sola. Aquí comparto cómo construí mi nueva tribu de amigas.</p>

          <h2>La Soledad del Migrante es Real</h2>
          <p>No minimices tus sentimientos. Es normal sentirse sola al principio. Extrañar a tus amigas de siempre, las risas espontáneas, las llamadas de emergencia a las 2am. Lloré mucho los primeros meses. Y está bien.</p>

          <h2>Estrategias que Funcionaron para Mí</h2>

          <h3>1. Grupos de Facebook para Latinas</h3>
          <p>Busqué grupos como "Latinas en Toronto", "Colombianas en Canadá", "Mujeres Migrantes GTA". Empecé asistiendo a meetups virtuales y luego presenciales. Mi mejor amiga actual la conocí en un brunch de un grupo de Facebook.</p>

          <h3>2. Clases Grupales</h3>
          <p>Me inscribí en clases de salsa, yoga y cocina. La repetición semanal me ayudó a crear conexiones naturales. Ver las mismas caras cada semana facilitó conversaciones más profundas.</p>

          <h3>3. Voluntariado en Organizaciones Latinas</h3>
          <p>Ofrecí mi tiempo a organizaciones que apoyan a migrantes. No solo ayudé a otras, sino que conocí mujeres increíbles con valores similares.</p>

          <h3>4. Ser Vulnerable y Auténtica</h3>
          <p>El secreto: ser yo misma desde el inicio. No fingir que todo está bien. Cuando compartí mis miedos y desafíos, otras mujeres se abrieron también. La vulnerabilidad crea conexión.</p>

          <h2>Red Flags a Evitar</h2>
          <p>Cuidado con personas que solo hablan de sí mismas, te hacen sentir menos, o constantemente cancelan planes. Tu tiempo y energía son valiosos.</p>

          <h2>La Calidad Sobre la Cantidad</h2>
          <p>No necesitas 20 amigas. Con 2-3 conexiones genuinas es suficiente. Mi círculo actual son 4 mujeres increíbles que me entienden, apoyan y celebran.</p>

          <h2>Mensaje Final</h2>
          <p>Encontrar amigas como adulta y migrante toma tiempo. Sé paciente contigo misma. Di sí a invitaciones (incluso cuando da pereza), inicia conversaciones, y recuerda: otras mujeres también están buscando conexión. Tu tribu está ahí afuera esperándote.</p>
        `,
        excerpt: 'Hacer amigas siendo adulta y migrante es un desafío. Te cuento cómo encontré a mi tribu en Toronto: grupos de Facebook, clases, vulnerabilidad y paciencia fueron clave.',
        featuredImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
        category: 'Amistad',
        tags: ['amistad', 'toronto', 'comunidad', 'grupos', 'networking'],
        author: testUser._id,
        status: 'published',
        isFeatured: true,
        views: 267,
        metaDescription: 'Guía práctica para hacer amigas en Toronto siendo migrante: grupos, clases y consejos reales.',
        metaKeywords: ['amigas', 'toronto', 'migrantes', 'comunidad', 'latinas'],
      },

      // ========================================
      // AMOR PROPIO
      // ========================================
      {
        title: 'Aprendí a Amarme en un País que No Me Conoce',
        slug: 'aprendi-amarme-pais-no-me-conoce',
        content: `
          <p>Migrar me obligó a reconstruirme desde cero. Perdí mi título profesional, mi estatus social, mi red de apoyo. En el proceso, aprendí a valorarme por quien soy, no por lo que tengo.</p>

          <h2>La Pérdida de Identidad</h2>
          <p>En mi país era gerente de marketing. Aquí, empecé sirviendo cafés. El golpe a mi ego fue brutal. Me sentía invisible, sin valor. ¿Quién era yo sin mis logros?</p>

          <h2>El Punto de Quiebre</h2>
          <p>Lloré durante semanas. Hasta que un día me miré al espejo y decidí: o me amo ahora, en este momento, con este trabajo "menor", o nunca lo haré. El amor propio no puede depender de factores externos.</p>

          <h2>Reconstruyendo Mi Autoestima</h2>

          <h3>Celebré Pequeñas Victorias</h3>
          <p>Pedí mi café en inglés sin trabas. Victoria. Hice una amiga nueva. Victoria. Sobreviví un invierno canadiense. ¡Gran victoria! Empecé un diario de agradecimiento donde escribo 3 logros diarios, por pequeños que sean.</p>

          <h3>Reconecté con Mis Pasiones</h3>
          <p>Volví a pintar, algo que amaba de niña pero dejé por "falta de tiempo". Bailé salsa solo porque me hacía feliz. Leí libros que me inspiraban. Me reencontré con partes de mí que había olvidado.</p>

          <h3>Establecí Límites Firmes</h3>
          <p>Dejé de justificar mi vida ante familiares que cuestionaban mi decisión de migrar. Dejé de compararme con otras migrantes que "lo lograron más rápido". Mi camino es único.</p>

          <h3>Invertí en Mi Bienestar</h3>
          <p>Terapia fue clave. Hablar con alguien neutral me ayudó a procesar el duelo migratorio. También empecé a cuidar mi cuerpo: ejercicio, buena comida, descanso adecuado.</p>

          <h2>El Amor Propio es un Compromiso Diario</h2>
          <p>No es un destino, es una práctica. Algunos días me amo profundamente. Otros, lucho contra la autocrítica. Pero cada día elijo tratarme con compasión, como trataría a mi mejor amiga.</p>

          <h2>Para Ti que Estás Luchando</h2>
          <p>Eres valiosa. Tu valor no depende de tu trabajo, tu cuenta bancaria, tu nivel de inglés o tu estatus migratorio. Eres digna de amor solo por existir. Empieza hoy: mírate al espejo y di "soy suficiente". Créelo.</p>
        `,
        excerpt: 'Mi viaje hacia el amor propio mientras reconstruía mi vida en Canadá. Cómo aprendí a valorarme sin mis títulos, estatus o logros previos.',
        featuredImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88',
        category: 'Amor Propio',
        tags: ['amor propio', 'autoestima', 'identidad', 'crecimiento personal', 'terapia'],
        author: testUser._id,
        status: 'published',
        isFeatured: false,
        views: 198,
        metaDescription: 'Cómo reconstruí mi autoestima y aprendí a amarme durante el proceso migratorio en Canadá.',
        metaKeywords: ['amor propio', 'autoestima', 'migración', 'identidad', 'bienestar'],
      },

      // ========================================
      // MIGRACIÓN
      // ========================================
      {
        title: 'Lo que Nadie Te Dice Sobre Migrar a Canadá: La Verdad Sin Filtros',
        slug: 'nadie-te-dice-migrar-canada-verdad-sin-filtros',
        content: `
          <p>Todos en redes sociales muestran lo bonito: la nieve, las fotos en Toronto, el nuevo carro. Pero nadie habla de las noches llorando, la frustración, el duelo. Aquí va mi verdad sin filtro.</p>

          <h2>1. El Frío No Es Solo Físico</h2>
          <p>Sí, el invierno canadiense es brutal (-30°C es real). Pero el frío emocional es peor. La distancia de tu familia, las fiestas que te pierdes, los abrazos que necesitas y no puedes recibir. Ese frío cala más hondo.</p>

          <h2>2. Tus Títulos Pueden No Valer Nada</h2>
          <p>Estudié 5 años de medicina. Aquí, necesito revalidar todo, hacer exámenes caros, esperar años. Mientras tanto, trabajo en lo que puedo. Es humillante, pero es la realidad para muchos.</p>

          <h2>3. El Idioma es una Barrera Invisible</h2>
          <p>Hablar inglés en clase es diferente a hablarlo en vida real. Los acentos canadienses, las expresiones coloquiales, la velocidad... Al principio, me sentía tonta preguntando "¿qué?" constantemente.</p>

          <h2>4. La Soledad es Real</h2>
          <p>Canadá puede ser muy individualista. No hay amigas tocando tu puerta sin avisar. No hay familia dominical. El silencio de tu apartamento los fines de semana puede ser ensordecedor.</p>

          <h2>5. Todo Cuesta Más de lo que Esperas</h2>
          <p>Renta, comida, transporte, impuestos... El costo de vida en Toronto es altísimo. Tus ahorros se evaporan rápido. Presupuesta muy bien antes de venir.</p>

          <h2>6. El Sistema es Diferente</h2>
          <p>Healthcare gratuito suena genial, pero esperar 3 meses para ver un especialista es frustrante. Las diferencias culturales en trabajo, dating, amistad... Todo requiere adaptación.</p>

          <h2>7. Extrañarás la Comida de Casa</h2>
          <p>Encontrar ingredientes latinos es posible pero caro. Y nada sabe exactamente como en casa. Lloré la primera vez que probé una arepa aquí. No era lo mismo.</p>

          <h2>Pero También...</h2>
          <p>A pesar de todo, Canadá me dio oportunidades que no tenía. Seguridad, estabilidad, derechos, naturaleza impresionante. Crecí más de lo que imaginé. Pero no fue el camino color rosa que pintan en Instagram.</p>

          <h2>Mi Consejo</h2>
          <p>Ven con los ojos abiertos. Ahorros sólidos. Preparación emocional. Red de apoyo virtual. Y sobre todo: compasión contigo misma. Migrar es de las cosas más valientes que harás. No está bien todo el tiempo, y eso está bien.</p>
        `,
        excerpt: 'La verdad sin filtros sobre migrar a Canadá: frío, duelo, títulos no válidos, soledad y costos altos. Lo que las fotos de Instagram no muestran.',
        featuredImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce',
        category: 'Migración',
        tags: ['migración', 'canadá', 'realidad', 'consejos', 'expatriados'],
        author: testUser._id,
        status: 'published',
        isFeatured: true,
        views: 521,
        metaDescription: 'La verdad sin filtros sobre migrar a Canadá: desafíos reales que nadie menciona en redes sociales.',
        metaKeywords: ['migración', 'canadá', 'expatriados', 'latinas', 'toronto'],
      },

      // ========================================
      // CONSEJOS
      // ========================================
      {
        title: '10 Apps Esenciales para Mujeres Latinas en Canadá',
        slug: '10-apps-esenciales-mujeres-latinas-canada',
        content: `
          <p>La tecnología puede hacer tu vida de migrante mucho más fácil. Aquí mis apps favoritas que uso diariamente en Canadá.</p>

          <h2>1. Bunz (Trading & Community)</h2>
          <p>Intercambia cosas que no usas por cosas que necesitas. Perfecta para cuando llegas sin mucho presupuesto. También tiene grupos comunitarios para hacer amigas.</p>

          <h2>2. Flipp (Flyers & Deals)</h2>
          <p>Compara precios de supermercados, ve los flyers semanales, encuentra descuentos. Ahorras mucho dinero en groceries. Indispensable para estirar tu presupuesto.</p>

          <h2>3. Meetup (Eventos & Comunidad)</h2>
          <p>Encuentra eventos de todo tipo: hiking, idiomas, networking, cenas. Excelente para hacer amigas y salir de tu zona de confort.</p>

          <h2>4. Transit (Navegación TTC)</h2>
          <p>La mejor app para usar TTC en Toronto. Rutas en tiempo real, alertas de retrasos, planificador de viajes. Mucho mejor que Google Maps para transporte público.</p>

          <h2>5. Presto (Tarjeta de Transporte)</h2>
          <p>Recarga tu Presto card desde tu celular. Revisa tu balance, ve tu historial. Básica si usas TTC regularmente.</p>

          <h2>6. Too Good To Go (Comida con Descuento)</h2>
          <p>Compra comida de restaurantes y cafés con 50-70% descuento al final del día. Reduces desperdicio y ahorras dinero. Win-win.</p>

          <h2>7. Rakuten (Cashback)</h2>
          <p>Recibe cashback en compras online. Si vas a comprar en Amazon, Best Buy, etc., hazlo a través de Rakuten y recupera dinero.</p>

          <h2>8. WhatsApp (Obvio pero Esencial)</h2>
          <p>Para mantenerte en contacto con familia y amigas de tu país sin gastar en llamadas internacionales. Llamadas de video gratuitas son oro.</p>

          <h2>9. Duolingo (Aprender Francés)</h2>
          <p>Si quieres aprender francés para mejorar tu perfil migratorio, Duolingo es gratis y efectivo. 15 minutos diarios hacen diferencia.</p>

          <h2>10. Mint (Presupuesto Personal)</h2>
          <p>Administra tus finanzas, establece presupuestos, rastrea gastos. Esencial cuando estás ajustando a un nuevo costo de vida.</p>

          <h2>Bonus: Facebook Groups</h2>
          <p>No es app nativa, pero grupos de Facebook como "Latinas en Toronto", "Mujeres Profesionales Toronto", "Colombianas en Canadá" son comunidades invaluables.</p>

          <h2>Conclusión</h2>
          <p>Estas apps me facilitaron tanto la vida. Descárgalas, explóralas, úsalas. La tecnología puede ser tu mejor aliada como migrante.</p>
        `,
        excerpt: 'Las 10 apps que uso diariamente en Canadá para ahorrar dinero, hacer amigas, navegar la ciudad y administrar mi vida de migrante.',
        featuredImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
        category: 'Consejos',
        tags: ['apps', 'tecnología', 'ahorro', 'toronto', 'tips'],
        author: testUser._id,
        status: 'published',
        isFeatured: false,
        views: 412,
        metaDescription: '10 aplicaciones esenciales para latinas viviendo en Canadá: ahorro, comunidad, transporte y más.',
        metaKeywords: ['apps', 'canadá', 'toronto', 'ahorro', 'latinas'],
      },

      // ========================================
      // HISTORIAS
      // ========================================
      {
        title: 'De Gerente en Colombia a Barista en Toronto: Mi Historia de Reinvención',
        slug: 'gerente-colombia-barista-toronto-historia-reinvencion',
        content: `
          <p>Hace cuatro años, dejé mi vida en Bogotá: apartamento propio, cargo gerencial, estabilidad. Llegué a Toronto con dos maletas, inglés básico y mucho miedo. Esta es mi historia.</p>

          <h2>El Inicio: Privilegio y Confort</h2>
          <p>Trabajaba como Gerente de Marketing en una empresa multinacional. Buen salario, equipo a mi cargo, respeto profesional. Tenía 32 años y pensaba: "¿Para qué arriesgar todo esto?"</p>

          <h2>La Decisión</h2>
          <p>La inseguridad en Bogotá empeoró. Me asaltaron dos veces en un año. Quería vivir sin miedo, caminar tranquila por las calles. Canadá representaba seguridad, naturaleza, oportunidades. Apliqué como skilled worker y me aceptaron.</p>

          <h2>La Caída: De Gerente a "Nobody"</h2>
          <p>Mi primer trabajo en Toronto fue en un Tim Hortons. De liderar equipos a servir cafés. Los clientes a veces se burlaban de mi acento. Compañeros de 18 años eran mis supervisores. Mi ego sufrió.</p>

          <p>Lloré en el baño del trabajo más veces de las que puedo contar. Pensaba: "Estudié 5 años en universidad, tengo maestría, 10 años de experiencia... ¿para esto?"</p>

          <h2>El Punto Más Bajo</h2>
          <p>Primer invierno. Temperatura de -25°C. Viviendo en un basement oscuro. Trabajando dos empleos para pagar renta. Sola en Navidad mientras veía stories de mi familia en Colombia reunida. Esa noche cuestioné todo.</p>

          <h2>El Giro</h2>
          <p>Conocí a Laura, otra migrante colombiana que llevaba 8 años aquí. Me dijo: "Los primeros dos años son los más duros. Pero mejora. Confía en el proceso." Esas palabras me sostuvieron.</p>

          <p>Empecé a estudiar inglés intensivamente. Certificaciones de marketing digital. Networking en LinkedIn. Voluntariado. Construyendo un nuevo CV, una nueva versión de mí.</p>

          <h2>La Reconstrucción</h2>
          <p>Año 2: Conseguí trabajo como Coordinadora de Marketing en una startup. Año 3: Ascendí a Marketing Manager. Año 4 (ahora): Dirijo el departamento de marketing de una empresa tech. Gano más que en Colombia, trabajo remoto, tengo PR.</p>

          <h2>Lo que Aprendí</h2>
          <p>1. Tu valor no depende de tu título o trabajo. Eres valiosa siempre.</p>
          <p>2. Los primeros años son durísimos. Pero son temporales.</p>
          <p>3. La humildad no es humillación. Trabajar en servicio al cliente me enseñó empatía.</p>
          <p>4. La comunidad es TODO. Otras mujeres migrantes me salvaron.</p>
          <p>5. El crecimiento requiere soltar tu ego y abrazar lo incómodo.</p>

          <h2>Para Ti que Estás Empezando</h2>
          <p>Si estás sirviendo mesas con un título universitario, limpiando casas con una maestría, o manejando Uber con años de experiencia profesional: te veo. Te honro. Esto no te define. Es solo un capítulo.</p>

          <p>Sigue aprendiendo. Sigue conectando. Sigue creyendo. Tu momento llegará. Y cuando mires atrás, entenderás por qué cada paso fue necesario.</p>

          <h2>Hoy</h2>
          <p>Camino por las calles de Toronto sin miedo. Tengo amigas increíbles. Una carrera que amo. Paz mental. Valió cada lágrima, cada sacrificio, cada momento de duda. Soy una versión más fuerte, sabia y compasiva de mí misma.</p>

          <p>Si yo pude, tú también puedes. Confía en tu proceso. 💪</p>
        `,
        excerpt: 'Mi viaje de gerente en Bogotá a barista en Toronto y vuelta a gerente: una historia real de sacrificio, resiliencia y reinvención en Canadá.',
        featuredImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f',
        category: 'Historias',
        tags: ['historia personal', 'reinvención', 'carrera', 'resiliencia', 'colombia'],
        author: testUser._id,
        status: 'published',
        isFeatured: false,
        views: 678,
        metaDescription: 'Historia real de reinvención profesional: de gerente en Colombia a barista y de vuelta a gerente en Toronto.',
        metaKeywords: ['reinvención', 'carrera', 'migración', 'colombia', 'toronto'],
      },

      // ========================================
      // CONSEJOS (Draft)
      // ========================================
      {
        title: 'Guía Completa: Cómo Preparar tu Finanzas Antes de Migrar',
        slug: 'guia-completa-preparar-finanzas-antes-migrar',
        content: `
          <p>Uno de los mayores errores que cometí fue llegar a Canadá sin preparación financiera adecuada. Aquí todo lo que necesitas saber.</p>

          <h2>Cuánto Dinero Necesitas</h2>
          <p>Como mínimo, trae $10,000 CAD por persona. Idealmente $15,000-$20,000. Los primeros 3-6 meses son críticos.</p>

          <h2>Gastos Iniciales (Primeros 3 Meses)</h2>
          <ul>
            <li>Depósito de apartamento (primer mes + último mes): $3,000-$4,000</li>
            <li>Muebles básicos: $1,000-$2,000</li>
            <li>Comida y necesidades: $800-$1,200/mes</li>
            <li>Teléfono e internet: $100-$150/mes</li>
            <li>Transporte (Presto): $156/mes</li>
            <li>Emergencias: $1,000 mínimo</li>
          </ul>

          <h2>Antes de Venir</h2>
          <p>1. Cierra tarjetas de crédito que no necesites</p>
          <p>2. Liquida deudas si es posible</p>
          <p>3. Investiga bancos canadienses (RBC, TD, Scotiabank)</p>
          <p>4. Trae efectivo + tarjeta internacional</p>
          <p>5. Entiende tipos de cambio</p>

          <h2>Al Llegar</h2>
          <p>1. Abre cuenta bancaria inmediatamente (necesitas SIN primero)</p>
          <p>2. Aplica a una tarjeta de crédito secured para construir credit history</p>
          <p>3. Establece presupuesto estricto</p>
          <p>4. Descarga apps de finanzas (Mint, YNAB)</p>

          <p>Más detalles próximamente...</p>
        `,
        excerpt: 'Guía completa sobre preparación financiera antes de migrar a Canadá: cuánto dinero necesitas, gastos iniciales y consejos bancarios.',
        featuredImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e',
        category: 'Consejos',
        tags: ['finanzas', 'dinero', 'preparación', 'presupuesto', 'ahorro'],
        author: testUser._id,
        status: 'draft', // Este está en borrador
        isFeatured: false,
        views: 0,
        metaDescription: 'Guía de preparación financiera para migrar a Canadá: presupuesto, ahorros y consejos bancarios.',
        metaKeywords: ['finanzas', 'dinero', 'migración', 'presupuesto', 'canadá'],
      },
    ];

    // 5. Calcular readTime para cada artículo antes de insertar
    const blogPostsWithReadTime = blogPosts.map(post => {
      const words = post.content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(words / 200));
      return { ...post, readTime };
    });

    // 6. Insertar artículos en la base de datos
    console.log('📝 Insertando artículos...\n');
    const insertedPosts = await BlogPost.insertMany(blogPostsWithReadTime);
    console.log(`✅ ${insertedPosts.length} artículos insertados exitosamente\n`);

    // 7. Mostrar resumen de artículos creados
    console.log('📊 Resumen de artículos creados:\n');
    insertedPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   📂 Categoría: ${post.category}`);
      console.log(`   📝 Status: ${post.status}`);
      console.log(`   📖 Tiempo de lectura: ${post.readTime} min`);
      console.log(`   👁️  Vistas: ${post.views}`);
      console.log(`   🔗 Slug: ${post.slug}`);
      console.log(`   ${post.isFeatured ? '⭐ DESTACADO' : ''}`);
      console.log('');
    });

    // 8. Mostrar estadísticas generales
    const stats = await BlogPost.getStats();
    console.log('📈 Estadísticas generales:');
    console.log(`   Total artículos: ${stats.total}`);
    console.log(`   Publicados: ${stats.published}`);
    console.log(`   Borradores: ${stats.drafts}`);
    console.log(`   Destacados: ${stats.featured}`);
    console.log(`   Total vistas: ${stats.totalViews}`);
    console.log(`   Tiempo lectura promedio: ${stats.avgReadTime} min`);
    console.log('');
    console.log('   Por categoría:');
    stats.byCategory.forEach(cat => {
      console.log(`   - ${cat._id}: ${cat.count} artículos`);
    });
    console.log('');

    console.log('✅ Seed de artículos del blog completado exitosamente!\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    console.error(error.stack);
    process.exit(1);
  }
};

// Ejecutar seed
seedBlogPosts();
