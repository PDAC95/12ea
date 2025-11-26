import { useState, useEffect, useCallback } from 'react';
import api from '../../../shared/utils/api';

/**
 * useProfile - Hook personalizado para gestión de perfil de usuario
 *
 * Características:
 * - Fetch de datos de perfil
 * - Actualización de perfil
 * - Fetch de negocios del usuario
 * - Fetch de servicios del usuario
 * - Fetch de eventos próximos del usuario
 * - Estados de loading y error individuales
 *
 * Features Sprint 5+
 * Componente para gestión completa de perfil de usuario
 *
 * @returns {Object} Datos y funciones para gestión de perfil
 */
const useProfile = () => {
  // Estados de perfil
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  // Estados de negocios
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [errorBusinesses, setErrorBusinesses] = useState(null);

  // Estados de servicios
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errorServices, setErrorServices] = useState(null);

  // Estados de eventos
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errorEvents, setErrorEvents] = useState(null);

  /**
   * fetchProfile - Obtiene datos del perfil del usuario autenticado
   */
  const fetchProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      setErrorProfile(null);

      const response = await api.get('/users/profile');
      setProfile(response.data.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setErrorProfile(err.response?.data?.error?.message || 'Error al cargar el perfil');
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  /**
   * updateProfile - Actualiza el perfil del usuario
   * @param {Object|FormData} data - Datos a actualizar (puede ser FormData para upload de imagen)
   * @returns {Promise<Object>} Resultado de la actualización
   */
  const updateProfile = async (data) => {
    try {
      // Detectar si es FormData para configurar headers apropiados
      const isFormData = data instanceof FormData;
      const config = isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};

      const response = await api.put('/users/profile', data, config);
      setProfile(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Error updating profile:', err);
      const message = err.response?.data?.error?.message || 'Error al actualizar el perfil';
      return { success: false, error: message };
    }
  };

  /**
   * fetchMyBusinesses - Obtiene negocios del usuario
   */
  const fetchMyBusinesses = useCallback(async () => {
    try {
      setLoadingBusinesses(true);
      setErrorBusinesses(null);

      const response = await api.get('/businesses/my/list');
      setBusinesses(response.data.data || []);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setErrorBusinesses(err.response?.data?.error?.message || 'Error al cargar tus negocios');
    } finally {
      setLoadingBusinesses(false);
    }
  }, []);

  /**
   * fetchMyServices - Obtiene servicios del usuario
   */
  const fetchMyServices = useCallback(async () => {
    try {
      setLoadingServices(true);
      setErrorServices(null);

      const response = await api.get('/services/my/list');
      setServices(response.data.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setErrorServices(err.response?.data?.error?.message || 'Error al cargar tus servicios');
    } finally {
      setLoadingServices(false);
    }
  }, []);

  /**
   * fetchMyEvents - Obtiene eventos próximos del usuario
   */
  const fetchMyEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      setErrorEvents(null);

      const response = await api.get('/events/my-registrations', {
        params: {
          status: 'confirmed',
          upcoming: true,
        },
      });

      setEvents(response.data.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setErrorEvents(err.response?.data?.error?.message || 'Error al cargar tus eventos');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  /**
   * Fetch inicial del perfil al montar el hook
   */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    // Profile
    profile,
    loadingProfile,
    errorProfile,
    fetchProfile,
    updateProfile,

    // Businesses
    businesses,
    loadingBusinesses,
    errorBusinesses,
    fetchMyBusinesses,

    // Services
    services,
    loadingServices,
    errorServices,
    fetchMyServices,

    // Events
    events,
    loadingEvents,
    errorEvents,
    fetchMyEvents,
  };
};

export default useProfile;
