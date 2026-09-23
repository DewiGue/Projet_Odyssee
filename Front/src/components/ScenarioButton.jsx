// TODO: La liste complète des scénarios n'est pas encore définie dans le contrat d'API.
// Seul "server_down" est mentionné au §6 de la feuille de route.
// Ne pas coder en dur la liste des scénarios ici tant que le contrat n'est pas figé avec Dewi.
// Ce composant reste générique : il affiche un bouton pour UN scénario donné (label + action).

export default function ScenarioButton({ label, onClick, isActive = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
        isActive
          ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
          : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-cyan-500/40 hover:text-cyan-300'
      }`}
    >
      {label}
    </button>
  )
}