export function getSocketAdminUiUrl() {
  const adminUiUrl = import.meta.resolve('@socket.io/admin-ui');
  return new URL('../ui/dist', adminUiUrl)
}