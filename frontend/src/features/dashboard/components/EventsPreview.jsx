import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import EventCard from './EventCard';

/**
 * EventsPreview - Preview de próximos eventos
 *
 * Features:
 * - Muestra los próximos 3 eventos
 * - Mock data (temporalmente - Sprint 2)
 * - Grid responsive (3 cols desktop, 2 tablet, 1 móvil)
 * - Link "Ver todos los eventos"
 * - Section header con icono
 *
 * Sprint 2 - Task 3.4 ✅
 * Sprint 3 - Actualizado con capacidad y registros
 *
 * @returns {JSX.Element} Preview de eventos
 */
const EventsPreview = () => {
  // Mock data de eventos (temporal - se reemplazará con API en Sprint 3)
  const mockEvents = [
    {
      _id: '1',
      title: 'Taller de Finanzas Personales para Emprendedoras',
      date: '2025-11-20',
      time: '18:00',
      mode: 'virtual',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60',
      capacity: 30,
      registeredCount: 18,
    },
    {
      _id: '2',
      title: 'Networking: Conecta con Empresarias Latinas en Toronto',
      date: '2025-11-25',
      time: '19:30',
      mode: 'presencial',
      location: 'Downtown Toronto',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
      capacity: 50,
      registeredCount: 3,
    },
    {
      _id: '3',
      title: 'Webinar: Inmigración y Oportunidades Laborales en Canadá',
      date: '2025-12-02',
      time: '17:00',
      mode: 'virtual',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60',
      capacity: 100,
      registeredCount: 65,
    },
  ];

  return (
    <section className="py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Próximos Eventos</h2>
            <p className="text-sm text-gray-600">
              No te pierdas estas actividades comunitarias
            </p>
          </div>
        </div>

        {/* Ver Todos Link - Hidden en móvil pequeño */}
        <Link
          to="/dashboard/events"
          className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm group transition-colors"
        >
          Ver todos
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {/* Ver Todos Link - Visible solo en móvil */}
      <div className="mt-6 md:hidden">
        <Link
          to="/dashboard/events"
          className="flex items-center justify-center gap-2 w-full py-3 text-primary-600 hover:text-primary-700 font-medium text-sm border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
        >
          Ver todos los eventos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Empty State - Mostrar cuando no hay eventos (para futuro) */}
      {mockEvents.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2 font-medium">No hay eventos próximos</p>
          <p className="text-sm text-gray-500">
            Vuelve pronto para ver nuevas actividades
          </p>
        </div>
      )}
    </section>
  );
};

export default EventsPreview;
