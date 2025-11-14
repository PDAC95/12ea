import AdminBlogList from '../blog/AdminBlogList';

/**
 * AdminBlogPage - Página de gestión de blog para admin
 * Task 10.7 - Sprint 4
 *
 * Wrapper simple que renderiza AdminBlogList
 * La ruta /admin/blog renderiza este componente
 */
const AdminBlogPage = () => {
  return <AdminBlogList />;
};

export default AdminBlogPage;
