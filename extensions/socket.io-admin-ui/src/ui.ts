export function getUiUrl() {
  const adminUiUrl = import.meta.resolve('@socket.io/admin-ui');
  return new URL('../ui/dist', adminUiUrl)
}