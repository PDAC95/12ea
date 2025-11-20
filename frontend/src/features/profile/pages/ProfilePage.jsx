import { useAuth } from '../../auth/context/AuthContext';
import DashboardLayout from '../../dashboard/components/DashboardLayout';
import { User, Mail, Calendar, MapPin, Phone, Edit3, CalendarDays, Briefcase, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../../shared/utils/api';
import EventCard from '../../dashboard/components/EventCard';
import BusinessCard from '../../business/components/BusinessCard';
import { useNavigate } from 'react-router-dom';

/**
 * ProfilePage - Página de perfil de usuario
 *
 * Features:
 * - Muestra información del usuario autenticado
 * - Sección "Mis Eventos Registrados"
 * - Sección "Mis Negocios" (si tiene)
 * - Botón "Editar Perfil" (disabled por ahora)
 * - Loading states
 * - Error states
 * - Empty states
 *
 * Sprint 5 - US-5.9: Dashboard Content Updates
 * Task 5.9.3 - Crear Sección Mi Perfil
 *
 * @returns {JSX.Element} Página de perfil
 */
const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados para eventos registrados
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [errorRegistrations, setErrorRegistrations] = useState(null);

  // Estados para negocios del usuario
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [errorBusinesses, setErrorBusinesses] = useState(null);

  /**
   * Fetch de eventos registrados del usuario
   */
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoadingRegistrations(true);
        setErrorRegistrations(null);

        const response = await api.get('/events/my-registrations', {
          params: {
            status: 'confirmed',
            upcoming: true,
          },
        });

        setRegistrations(response.data.data || []);
      } catch (err) {
        console.error('Error fetching registrations:', err);
        setErrorRegistrations(
          err.response?.data?.error?.message || 'Error al cargar tus eventos registrados'
        );
      } finally {
        setLoadingRegistrations(false);
      }
    };

    fetchRegistrations();
  }, []);

  /**
   * Fetch de negocios del usuario
   */
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoadingBusinesses(true);
        setErrorBusinesses(null);

        const response = await api.get('/businesses/my/list');
        setBusinesses(response.data.data || []);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setErrorBusinesses(
          err.response?.data?.error?.message || 'Error al cargar tus negocios'
        );
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchBusinesses();
  }, []);

  /**
   * Formatear fecha de nacimiento
   */
  const formatBirthday = (birthday) => {
    if (!birthday) return 'No especificada';
    return new Date(birthday).toLocaleDateString('es-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header con título */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="text-gray-600 mt-1">Gestiona tu información personal y actividades</p>
          </div>
        </div>

        {/* Card de Información Personal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header de la card con gradiente */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center ring-4 ring-white/30">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.preferredName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <h2 className="text-2xl font-bold">{user?.preferredName || 'Usuario'}</h2>
                  <p className="text-white/80 text-sm">{user?.fullName}</p>
                </div>
              </div>

              {/* Botón Editar Perfil (disabled) */}
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 cursor-not-allowed opacity-50"
                title="Próximamente disponible"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden md:inline">Editar Perfil</span>
              </button>
            </div>
          </div>

          {/* Body con información */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Email</p>
                <p className="text-gray-900">{user?.email}</p>
              </div>
            </div>

            {/* Teléfono */}
            {user?.phone && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Teléfono</p>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Cumpleaños */}
            {user?.birthday && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Fecha de Nacimiento</p>
                  <p className="text-gray-900">{formatBirthday(user.birthday)}</p>
                </div>
              </div>
            )}

            {/* Ciudad */}
            {user?.city && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Ciudad</p>
                  <p className="text-gray-900">{user.city}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección: Mis Eventos Registrados */}
        <section className="py-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg flex items-center justify-center shadow-sm">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mis Eventos Registrados</h2>
              <p className="text-sm text-gray-600">
                Eventos próximos en los que estás registrada
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loadingRegistrations && (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
              <p className="text-gray-600 font-medium">Cargando tus eventos...</p>
            </div>
          )}

          {/* Error State */}
          {!loadingRegistrations && errorRegistrations && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium mb-2">Error al cargar eventos</p>
              <p className="text-red-600 text-sm">{errorRegistrations}</p>
            </div>
          )}

          {/* Empty State */}
          {!loadingRegistrations && !errorRegistrations && registrations.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 font-medium">No tienes eventos registrados</p>
              <p className="text-sm text-gray-500 mb-4">
                Explora nuestros eventos y regístrate en los que te interesen
              </p>
              <button
                onClick={() => navigate('/dashboard/events')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                Ver eventos disponibles
              </button>
            </div>
          )}

          {/* Events Grid */}
          {!loadingRegistrations && !errorRegistrations && registrations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrations.map((registration) => (
                <EventCard
                  key={registration._id}
                  event={registration.event}
                  onClick={() => navigate('/dashboard/events')}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección: Mis Negocios */}
        <section className="py-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center shadow-sm">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mis Negocios</h2>
              <p className="text-sm text-gray-600">
                Negocios que has registrado en el directorio
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loadingBusinesses && (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-200">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
              <p className="text-gray-600 font-medium">Cargando tus negocios...</p>
            </div>
          )}

          {/* Error State */}
          {!loadingBusinesses && errorBusinesses && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium mb-2">Error al cargar negocios</p>
              <p className="text-red-600 text-sm">{errorBusinesses}</p>
            </div>
          )}

          {/* Empty State */}
          {!loadingBusinesses && !errorBusinesses && businesses.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2 font-medium">No tienes negocios registrados</p>
              <p className="text-sm text-gray-500 mb-4">
                Registra tu negocio y compártelo con la comunidad
              </p>
              <button
                onClick={() => navigate('/dashboard/businesses')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
              >
                Explorar directorio de negocios
              </button>
            </div>
          )}

          {/* Businesses Grid */}
          {!loadingBusinesses && !errorBusinesses && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
