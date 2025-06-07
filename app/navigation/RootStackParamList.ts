// app/navigation/RootStackParamList.ts

export type RootStackParamList = {
  // Rutas accesibles para Visitantes (no logueados) y Clientes (logueados)
  Home: undefined;
  Categories: undefined;
  BusinessDetails: { id: string };
  BusinessList: { categoryId: string; categoryName: string };

  // Rutas de Autenticación (accesibles desde VisitorStack)
  Login: undefined;
  Register: undefined;

  // Pilas de la Aplicación Principal (renderizadas condicionalmente en AppNavigator)
  VisitorStack: undefined; // Representa la pila de navegación para visitantes/clientes
  BusinessStack: undefined; // Representa la pila de navegación para negocios

  // Rutas específicas de negocio (si se navega directamente a ellas)
  BusinessDashboard: undefined;
  // Puedes añadir más rutas específicas de negocio aquí
};
