import { Link } from 'react-router-dom';
import { UserPlus, LogIn, Sparkles, Users, Calendar, Store, BookOpen, Heart, MessageCircle, Shield, Star, CheckCircle, ArrowRight } from 'lucide-react';
import logo from '../../../assets/images/logo/logo.png';
import mainPhoto from '../../../assets/images/photos/main.jpg';
import photo1 from '../../../assets/images/photos/photo1.jpg';
import photo2 from '../../../assets/images/photos/photo2.jpg';
import BusinessCTA from '../components/BusinessCTA';

/**
 * LandingPage - Página pública de inicio con diseño moderno y femenino profesional
 *
 * Ruta: /
 *
 * Features:
 * - Hero section con imagen de fondo profesional
 * - Diseño femenino y sofisticado
 * - Imágenes de stock de alta calidad
 * - Secciones visuales atractivas
 * - Testimonios y estadísticas
 * - CTAs destacados y estratégicos
 * - Sección BusinessCTA para emprendedoras (Sprint 5 Task 5.11.1)
 *
 * @returns {JSX.Element} Landing page profesional
 */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Moderno */}
      <header className="bg-white/90 backdrop-blur-md shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Entre Amigas"
                className="w-12 h-12 object-contain"
              />
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Entre Amigas
              </span>
            </div>

            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 text-primary-600 hover:text-primary-700 font-medium transition-all hover:bg-primary-50 rounded-xl"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section Premium */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={mainPhoto}
            alt="Amigas felices juntas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 via-primary-500/90 to-secondary-500/85"></div>

          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white rounded-full"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido del Hero */}
            <div className="text-white">
              {/* Badge Premium */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-8">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">Únete a más de 500 mujeres</span>
              </div>

              {/* Título Principal */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight">
                Tu comunidad en
                <span className="block text-warm-200">Canadá</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-xl">
                Conecta con mujeres hispanas que comparten tu experiencia migratoria.
                Encuentra apoyo, amistad y oportunidades.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg hover:scale-105"
                >
                  <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Crear cuenta gratis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white/50 rounded-2xl hover:bg-white/10 hover:border-white transition-all duration-300 font-semibold text-lg"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>100% Gratis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Espacio seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Comunidad verificada</span>
                </div>
              </div>
            </div>

            {/* Benefits Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
                <Calendar className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Eventos semanales</h3>
                <p className="text-white/80 text-sm">Talleres, meetups y actividades para conectar</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
                <Users className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Conoce gente nueva</h3>
                <p className="text-white/80 text-sm">Mujeres que comparten tu experiencia</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
                <Heart className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Haz amigas verdaderas</h3>
                <p className="text-white/80 text-sm">Conexiones auténticas y duraderas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300">
                <Shield className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Apoyo mutuo</h3>
                <p className="text-white/80 text-sm">Comunidad que te entiende y apoya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 md:h-32 fill-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Valor Proposición con Imagen */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Imagen */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-3xl transform rotate-3"></div>
              <img
                src={photo2}
                alt="Amigas conversando y riendo"
                loading="lazy"
                decoding="async"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>

            {/* Contenido */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-semibold">¿Por qué Entre Amigas?</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
                Más que una red social,{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  somos familia
                </span>
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sabemos lo difícil que puede ser adaptarse a un nuevo país. Por eso creamos un espacio
                donde puedes ser tú misma, compartir tus experiencias y crecer junto a mujeres que entienden
                tu camino.
              </p>

              {/* Lista de beneficios */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Conexiones auténticas</h4>
                    <p className="text-gray-600">Conoce mujeres con tus mismos intereses y valores</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Eventos exclusivos</h4>
                    <p className="text-gray-600">Talleres, meetups y actividades pensadas para ti</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Apoyo mutuo</h4>
                    <p className="text-gray-600">Comparte recursos, consejos y experiencias valiosas</p>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Únete ahora
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section con Imágenes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas y recursos diseñados para ayudarte a conectar y crecer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Eventos */}
            <div className="group relative overflow-hidden rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="relative h-64">
                <img
                  src={photo1}
                  alt="Amigas en café disfrutando"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Eventos</h3>
                <p className="text-white/90">
                  Cafés, picnics y actividades divertidas para conocernos mejor
                </p>
              </div>
            </div>

            {/* Feature 2 - Directorio */}
            <div className="group relative overflow-hidden rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1522543558187-768b6df7c25c?q=80&w=2070&auto=format&fit=crop"
                  alt="Grupo de mujeres apoyándose"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/90 via-secondary-900/50 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                  <Store className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Directorio</h3>
                <p className="text-white/90">
                  Encuentra negocios de amigas emprendedoras de la comunidad
                </p>
              </div>
            </div>

            {/* Feature 3 - Blog */}
            <div className="group relative overflow-hidden rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
                  alt="Mujeres compartiendo historias"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent-900/90 via-accent-900/50 to-transparent"></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-2">Blog</h3>
                <p className="text-white/90">
                  Historias, consejos y experiencias reales de nuestra comunidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Lo que dicen nuestras amigas
            </h2>
            <p className="text-xl text-gray-600">
              Historias reales de mujeres que encontraron su comunidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warm-400 text-warm-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Entre Amigas me ayudó a sentirme menos sola en un país nuevo. Encontré amigas
                increíbles que entienden lo que es empezar de cero."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold">MC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">María C.</div>
                  <div className="text-sm text-gray-500">Kitchener/Waterloo</div>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warm-400 text-warm-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Los eventos son increíbles. He aprendido mucho y conocido personas maravillosas.
                Es el apoyo que necesitaba."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                  <span className="text-secondary-600 font-bold">AR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Ana R.</div>
                  <div className="text-sm text-gray-500">Cambridge</div>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-soft">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warm-400 text-warm-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Gracias a Entre Amigas pude conectar con otras emprendedoras y hacer crecer mi negocio.
                ¡Son mi red de apoyo!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-accent-600 font-bold">LP</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Laura P.</div>
                  <div className="text-sm text-gray-500">Guelph</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section - Sprint 5 Task 5.11.1 */}
      <BusinessCTA />

      {/* CTA Final Premium */}
      <section className="relative py-24 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
            alt="Grupo de amigas felices"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/95 to-secondary-600/95"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-8">
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Comienza hoy</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            ¿Lista para hacer nuevas amigas?
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Únete a cientos de mujeres hispanas que ya encontraron apoyo, amistad
            y oportunidades en Canadá
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-primary-600 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg hover:scale-105"
            >
              <UserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Crear mi cuenta gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-transparent text-white border-2 border-white/50 rounded-2xl hover:bg-white/10 hover:border-white transition-all duration-300 font-semibold text-lg"
            >
              Ya tengo cuenta
            </Link>
          </div>

          <p className="text-white/80 text-sm">
            Sin tarjeta de crédito • Cancela cuando quieras • Únete en 2 minutos
          </p>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logo}
                  alt="Entre Amigas"
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 object-contain"
                />
                <span className="text-2xl font-display font-bold text-white">Entre Amigas</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                La comunidad para mujeres migrantes hispanas en Canadá. Conecta, aprende y
                crece junto a mujeres que comparten tu camino.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 text-warm-400">
                  <Star className="w-4 h-4 fill-warm-400" />
                  <Star className="w-4 h-4 fill-warm-400" />
                  <Star className="w-4 h-4 fill-warm-400" />
                  <Star className="w-4 h-4 fill-warm-400" />
                  <Star className="w-4 h-4 fill-warm-400" />
                </div>
                <span className="text-gray-400">Valorado por 500+ mujeres</span>
              </div>
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h3 className="text-white font-semibold mb-4">Comunidad</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Únete gratis
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <a href="#eventos" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Eventos
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <a href="mailto:hola@entreamigas.ca" className="hover:text-primary-400 transition-colors">
                    hola@entreamigas.ca
                  </a>
                </li>
                <li>Kitchener/Waterloo</li>
                <li>Cambridge</li>
                <li>Guelph, Ontario</li>
              </ul>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 Entre Amigas. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="#privacidad" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Privacidad
                </a>
                <a href="#terminos" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Términos
                </a>
                <span className="text-gray-500">Hecho con 💜 en Canadá</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
