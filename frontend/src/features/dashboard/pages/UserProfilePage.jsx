import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { User, Store, Briefcase, CalendarDays } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import ProfileForm from '../components/ProfileForm';
import MyBusinessesList from '../components/MyBusinessesList';
import MyServicesList from '../components/MyServicesList';
import MyEventsList from '../components/MyEventsList';

/**
 * UserProfilePage - Página de perfil de usuario con 4 secciones
 *
 * Features:
 * - Tab 1: "Mi Perfil" - Formulario editable de perfil
 * - Tab 2: "Mis Negocios" - Lista de negocios con status badges
 * - Tab 3: "Mis Servicios" - Lista de servicios con status badges
 * - Tab 4: "Próximos Eventos" - Lista de eventos registrados
 * - Tabs horizontales en desktop, verticales en mobile
 * - Carga lazy de datos al cambiar de tab
 * - Design System: primary-500 (rosa), secondary-500 (lavanda)
 *
 * Sprint 5+ - Sistema de Perfil de Usuario
 *
 * @returns {JSX.Element} Página de perfil completa
 */
const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const {
    profile,
    loadingProfile,
    errorProfile,
    updateProfile,
    businesses,
    loadingBusinesses,
    errorBusinesses,
    fetchMyBusinesses,
    services,
    loadingServices,
    errorServices,
    fetchMyServices,
    events,
    loadingEvents,
    errorEvents,
    fetchMyEvents,
  } = useProfile();

  /**
   * Tabs configuration
   */
  const tabs = [
    {
      id: 'profile',
      label: 'Mi Perfil',
      icon: User,
      color: 'from-primary-500 to-secondary-500',
    },
    {
      id: 'businesses',
      label: 'Mis Negocios',
      icon: Store,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 'services',
      label: 'Mis Servicios',
      icon: Briefcase,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'events',
      label: 'Próximos Eventos',
      icon: CalendarDays,
      color: 'from-green-500 to-teal-500',
    },
  ];

  /**
   * Fetch data when switching tabs (lazy loading)
   */
  useEffect(() => {
    if (activeTab === 'businesses' && businesses.length === 0 && !loadingBusinesses) {
      fetchMyBusinesses();
    }

    if (activeTab === 'services' && services.length === 0 && !loadingServices) {
      fetchMyServices();
    }

    if (activeTab === 'events' && events.length === 0 && !loadingEvents) {
      fetchMyEvents();
    }
  }, [
    activeTab,
    businesses.length,
    loadingBusinesses,
    fetchMyBusinesses,
    services.length,
    loadingServices,
    fetchMyServices,
    events.length,
    loadingEvents,
    fetchMyEvents,
  ]);

  /**
   * Handle profile update
   */
  const handleUpdateProfile = async (formData) => {
    return await updateProfile(formData);
  };

  /**
   * Render tab content
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="max-w-3xl mx-auto">
            <ProfileForm profile={profile} onUpdate={handleUpdateProfile} />
          </div>
        );

      case 'businesses':
        return (
          <MyBusinessesList
            businesses={businesses}
            loading={loadingBusinesses}
            error={errorBusinesses}
          />
        );

      case 'services':
        return (
          <MyServicesList
            services={services}
            loading={loadingServices}
            error={errorServices}
          />
        );

      case 'events':
        return (
          <MyEventsList
            events={events}
            loading={loadingEvents}
            error={errorEvents}
          />
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu información personal y visualiza tus actividades
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Tabs - Horizontal */}
          <div className="hidden md:flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-medium transition-all relative ${
                    isActive
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive
                        ? `bg-gradient-to-br ${tab.color} text-white shadow-md`
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={isActive ? 'font-semibold' : ''}>{tab.label}</span>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Tabs - Vertical Grid */}
          <div className="md:hidden grid grid-cols-2 gap-2 p-4 bg-gray-50 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-md'
                      : 'text-gray-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive
                        ? `bg-gradient-to-br ${tab.color} text-white`
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs text-center ${isActive ? 'font-semibold' : ''}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {loadingProfile && activeTab === 'profile' ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Cargando tu perfil...</p>
                </div>
              </div>
            ) : errorProfile && activeTab === 'profile' ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-700 font-medium mb-2">Error al cargar el perfil</p>
                <p className="text-red-600 text-sm">{errorProfile}</p>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
