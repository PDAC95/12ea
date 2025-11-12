// frontend/src/shared/constants/categories.js

export const BUSINESS_CATEGORIES = [
  'Gastronomía',
  'Belleza y Bienestar',
  'Salud',
  'Fitness',
  'Consultoría',
  'Moda y Accesorios',
  'Servicios del Hogar',
  'Artesanías',
  'Fotografía y Video',
  'Educación y Tutorías',
  'Tecnología',
  'Entretenimiento',
  'Deportes',
  'Automotriz',
  'Bienes Raíces',
  'Seguros',
  'Trámites y Gestorías'
];

export const SERVICE_CATEGORIES = [
  'Salud',
  'Salud Mental',
  'Dental',
  'Legal',
  'Inmigración',
  'Financiero',
  'Educación',
  'Traducción',
  'Gobierno',
  'Emergencias'
];

// Helper para iconos de Lucide React (opcional)
export const getCategoryIcon = (category) => {
  const icons = {
    'Gastronomía': 'UtensilsCrossed',
    'Belleza y Bienestar': 'Sparkles',
    'Salud': 'Heart',
    'Fitness': 'Dumbbell',
    'Consultoría': 'Briefcase',
    'Moda y Accesorios': 'Shirt',
    'Servicios del Hogar': 'Home',
    'Artesanías': 'Palette',
    'Fotografía y Video': 'Camera',
    'Educación y Tutorías': 'GraduationCap',
    'Tecnología': 'Laptop',
    'Entretenimiento': 'Music',
    'Deportes': 'Trophy',
    'Automotriz': 'Car',
    'Bienes Raíces': 'Building2',
    'Seguros': 'Shield',
    'Trámites y Gestorías': 'FileText'
  };

  return icons[category] || 'Circle';
};

// Helper para colores de badges de categorías (Tailwind classes)
export const getCategoryColor = (category) => {
  const colors = {
    // Business Categories
    'Gastronomía': 'bg-orange-100 text-orange-700',
    'Belleza y Bienestar': 'bg-pink-100 text-pink-700',
    'Salud': 'bg-red-100 text-red-700',
    'Fitness': 'bg-green-100 text-green-700',
    'Consultoría': 'bg-purple-100 text-purple-700',
    'Moda y Accesorios': 'bg-blue-100 text-blue-700',
    'Servicios del Hogar': 'bg-teal-100 text-teal-700',
    'Artesanías': 'bg-amber-100 text-amber-700',
    'Fotografía y Video': 'bg-indigo-100 text-indigo-700',
    'Educación y Tutorías': 'bg-cyan-100 text-cyan-700',
    'Tecnología': 'bg-violet-100 text-violet-700',
    'Entretenimiento': 'bg-fuchsia-100 text-fuchsia-700',
    'Deportes': 'bg-lime-100 text-lime-700',
    'Automotriz': 'bg-slate-100 text-slate-700',
    'Bienes Raíces': 'bg-sky-100 text-sky-700',
    'Seguros': 'bg-emerald-100 text-emerald-700',
    'Trámites y Gestorías': 'bg-rose-100 text-rose-700',
    // Service Categories
    'Salud Mental': 'bg-purple-100 text-purple-700',
    'Dental': 'bg-blue-100 text-blue-700',
    'Legal': 'bg-indigo-100 text-indigo-700',
    'Inmigración': 'bg-teal-100 text-teal-700',
    'Financiero': 'bg-green-100 text-green-700',
    'Educación': 'bg-cyan-100 text-cyan-700',
    'Traducción': 'bg-amber-100 text-amber-700',
    'Gobierno': 'bg-slate-100 text-slate-700',
    'Emergencias': 'bg-red-100 text-red-700',
  };

  return colors[category] || 'bg-gray-100 text-gray-700';
};
