// Hook de autenticação simplificado
export const useAuth = () => {
  return {
    user: null,
    isAuthenticated: false,
    login: async () => {},
    logout: () => {},
    loading: false,
  };
};
