import { Link } from 'react-router-dom';
import { Store, Briefcase, ArrowRight, Sparkles } from 'lucide-react';

/**
 * BusinessCTA - Sección CTA para invitar a agregar negocios y servicios
 *
 * Features:
 * - Diseño atractivo con gradiente
 * - 2 CTAs claros: "Agregar mi negocio" y "Ofrecer mis servicios"
 * - Responsive design
 * - Animaciones suaves
 * - Redirect a /register con parámetro de intención
 *
 * Sprint 5 - US-5.11: Landing Page CTA
 * Task 5.11.1 - Agregar Sección "Agregar Negocio" en Landing
 *
 * @returns {JSX.Element} Sección CTA para negocios y servicios
 */
const BusinessCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Container con diseño atractivo */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 p-1">
          {/* Inner container blanco */}
          <div className="bg-white rounded-[22px] p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Para emprendedoras</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">
                ¿Tienes un negocio o servicio?
              </h2>

              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comparte tu emprendimiento con nuestra comunidad de mujeres hispanas en Canadá.
                Aumenta tu visibilidad y conecta con potenciales clientes.
              </p>
            </div>

            {/* CTAs Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* CTA 1: Agregar Negocio */}
              <div className="group relative bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-primary-200 hover:border-primary-400">
                {/* Decoración de fondo */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all"></div>

                {/* Contenido */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Store className="w-8 h-8 text-white" />
                  </div>

                  {/* Texto */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Agregar mi negocio</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Tienda, restaurante, salón de belleza... Dale visibilidad a tu negocio en
                    nuestra comunidad.
                  </p>

                  {/* Lista de beneficios */}
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                      Perfil completo con fotos y contacto
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                      Alcanza a cientos de potenciales clientes
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                      100% gratis para nuestra comunidad
                    </li>
                  </ul>

                  {/* Botón */}
                  <Link
                    to="/register?intent=business"
                    className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all group-hover:shadow-lg"
                  >
                    Registrar mi negocio
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* CTA 2: Ofrecer Servicios */}
              <div className="group relative bg-gradient-to-br from-secondary-50 to-secondary-100/50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border-2 border-secondary-200 hover:border-secondary-400">
                {/* Decoración de fondo */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-secondary-500/10 rounded-full blur-2xl group-hover:bg-secondary-500/20 transition-all"></div>

                {/* Contenido */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>

                  {/* Texto */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Ofrecer mis servicios</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Contadora, diseñadora, fotógrafa... Comparte tus servicios profesionales
                    con amigas.
                  </p>

                  {/* Lista de beneficios */}
                  <ul className="space-y-2 mb-6 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full"></div>
                      Perfil profesional destacado
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full"></div>
                      Conecta con clientes ideales
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-secondary-500 rounded-full"></div>
                      Construye tu red profesional
                    </li>
                  </ul>

                  {/* Botón */}
                  <Link
                    to="/register?intent=service"
                    className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl font-semibold hover:from-secondary-600 hover:to-secondary-700 transition-all group-hover:shadow-lg"
                  >
                    Publicar mis servicios
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                🎉 Únete a más de 150+ negocios y servicios registrados en nuestra comunidad
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCTA;
