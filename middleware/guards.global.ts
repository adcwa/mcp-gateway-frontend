export default defineNuxtRouteMiddleware((to, from) => {
  // You can implement authentication or other guards here
  console.log(`Navigating from ${from.path} to ${to.path}`);
}); 