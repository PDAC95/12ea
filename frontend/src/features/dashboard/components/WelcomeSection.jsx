import { useAuth } from '../../auth/context/AuthContext';
import { Sparkles, Heart } from 'lucide-react';

/**
 * WelcomeSection - Sección de bienvenida personalizada
 *
 * Features:
 * - Mensaje de bienvenida con nombre del usuario
 * - Diseño acogedor con gradiente suave
 * - Iconos decorativos
 * - Responsive design
 * - Fallback si no hay nombre
 *
 * Sprint 2 - Task 3.2 ✅
 *
 * @returns {JSX.Element} Sección de bienvenida
 */
const WelcomeSection = () => {
  const { user } = useAuth();

  // Obtener el nombre a mostrar (preferredName > fullName > fallback)
  const displayName = user?.preferredName || user?.fullName || null;

  // Obtener hora del día para saludo personalizado
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 19) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 p-8 md:p-10 shadow-soft-lg">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
        <Sparkles className="w-32 h-32 text-white" />
      </div>
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 opacity-10">
        <Heart className="w-40 h-40 text-white" fill="currentColor" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Greeting */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-white/90" />
          <p className="text-white/90 font-medium text-sm md:text-base">
            {getGreeting()}
          </p>
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
          {displayName ? (
            <>
              ¡Hola, <span className="text-white/95">{displayName}</span>!
            </>
          ) : (
            '¡Hola!'
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 text-sm md:text-base max-w-2xl">
          Bienvenida a tu espacio en <span className="font-semibold">Entre Amigas</span>
          . Aquí encontrarás todo lo que necesitas para conectar, crecer y prosperar
          junto a nuestra comunidad de mujeres latinas.
        </p>

        {/* Decorative Line */}
        <div className="mt-6 h-1 w-24 bg-white/30 rounded-full"></div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default WelcomeSection;
