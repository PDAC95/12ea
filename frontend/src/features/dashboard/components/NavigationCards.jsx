import {
  Calendar,
  Building2,
  Briefcase,
  BookOpen,
  User,
} from 'lucide-react';
import NavigationCard from './NavigationCard';

/**
 * NavigationCards - Grid de cards de navegación principal
 *
 * Features:
 * - 5 cards de navegación a secciones principales
 * - Grid responsive (3 cols desktop, 2 tablet, 1 móvil)
 * - Cada card con icono, título, descripción y gradiente único
 * - Navegación con React Router
 * - Badges para secciones en desarrollo
 *
 * Sprint 2 - Task 3.3 ✅
 *
 * @returns {JSX.Element} Grid de cards de navegación
 */
const NavigationCards = () => {
  // Definición de cards de navegación
  const navigationCards = [
    {
      id: 'events',
      title: 'Eventos',
      description: 'Encuentra actividades comunitarias, talleres y meetups para conectar con otras mujeres latinas',
      icon: Calendar,
      path: '/dashboard/events',
      gradient: 'from-purple-400 to-pink-400',
    },
    {
      id: 'businesses',
      title: 'Negocios',
      description: 'Descubre negocios de mujeres latinas emprendedoras en tu ciudad y apoya la economía local',
      icon: Building2,
      path: '/dashboard/businesses',
      gradient: 'from-blue-400 to-cyan-400',
    },
    {
      id: 'services',
      title: 'Servicios',
      description: 'Directorio de servicios profesionales ofrecidos por nuestra comunidad: salud, legal, educación',
      icon: Briefcase,
      path: '/dashboard/services',
      gradient: 'from-green-400 to-emerald-400',
    },
    {
      id: 'blog',
      title: 'Blog',
      description: 'Lee artículos inspiradores, guías prácticas y comparte experiencias con la comunidad',
      icon: BookOpen,
      path: '/dashboard/blog',
      gradient: 'from-orange-400 to-amber-400',
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      description: 'Administra tu perfil, actualiza tu información y gestiona tus preferencias de privacidad',
      icon: User,
      path: '/dashboard/profile',
      gradient: 'from-primary-400 to-secondary-400',
    },
  ];

  return (
    <section className="py-4">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Explora la Comunidad
        </h2>
        <p className="text-gray-600">
          Accede rápidamente a las diferentes secciones de la plataforma
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationCards.map((card) => (
          <NavigationCard
            key={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            path={card.path}
            gradient={card.gradient}
            badge={card.badge}
          />
        ))}
      </div>
    </section>
  );
};

export default NavigationCards;
