# Odyssée — simulation, Prometheus, Grafana et front

Version préparée à partir du ZIP fourni par Tom le 23 septembre 2026. Cette version n’a pas été poussée sur GitHub. Elle est destinée au réseau de laboratoire.

## Ce qui est intégré

Le moteur réutilise les cinq zones de Dewi : réserve propre, cuve nutritive, sortie de pompe, climat et retour. Les consignes proviennent bien du dépôt : pH 5,8–6,5, EC 1,4–2,0 mS/cm, eau 18–22 °C et réserve de 1 210 L. Ce sont les paramètres du projet, pas une validation agronomique.

Le serveur de simulation fournit deux représentations du même état : JSON sur `/api/state`, et texte Prometheus sur `/metrics`. Prometheus collecte la seconde ; le front lit la première. Aucun plugin JSON/Infinity ni nouvelle source Grafana n’est nécessaire si la source Prometheus fonctionne déjà sur le port 9091.

La simulation est continue. Le front contient des actions effectives : arrêt et marche de la pompe, pause et reprise, pas manuel d’une seconde, accélération ×1/×10/×60, panne de pompe et niveau bas. Grafana affiche les effets après la collecte et le rafraîchissement du dashboard. Les commandes de pilotage se trouvent dans le front ; Grafana propose filtres, zoom temporel et rafraîchissement.

| Composant | Adresse de l’exemple | Fonction |
| --- | --- | --- |
| Simulation | `127.0.0.1:8000` sur Alma | API JSON, commandes et `/metrics` |
| Prometheus | `127.0.0.1:9091` sur Alma | Collecte et historique |
| Grafana | `192.168.0.14:3000` | Visualisation avec les comptes déjà créés |
| Front React/Vite | Port 5173 du PC qui lance Vite | Affichage et commandes de simulation |

Le proxy du front pointait auparavant vers 3000. Il pointe désormais vers 8000, avec une adresse configurable. Cela évite d’envoyer les appels de l’API à Grafana.

## 1. Installer la copie du projet sur Alma

Télécharge et décompresse l’archive modifiée dans un dossier distinct de ton travail courant. Les exemples supposent la racine du projet dans `/home/tom/Projet_Odyssee`. Adapte les chemins et le compte si `whoami` ne renvoie pas `tom`.

Depuis PowerShell, tu peux copier le dossier extrait vers Alma :

```powershell
scp -r .\Projet_Odyssee-integration tom@192.168.0.14:/home/tom/Projet_Odyssee
```

Cette destination doit être nouvelle, sinon SCP imbriquera le dossier. Tu peux aussi transférer le ZIP puis l’extraire sur Alma. Le dossier final doit contenir directement `backend`, `Front`, `labs` et `docs`.

Sur Alma :

```bash
cd /home/tom/Projet_Odyssee
python3 --version
python3 -m unittest discover -s labs/hydroponie_sim -p 'test_*.py' -v
```

Python 3.10 ou plus récent est requis. Les tests et le serveur de laboratoire utilisent la bibliothèque standard de Python : aucun nouveau paquet n’est requis. Tu peux conserver ton environnement virtuel et `prometheus-client` déjà installé. L’exporteur inclus écrit directement le format officiel Prometheus 0.0.4, sans passer par un fichier JSON ou une bibliothèque supplémentaire.

## 2. Démarrer la simulation

Dans le premier terminal Alma :

```bash
cd /home/tom/Projet_Odyssee
python3 labs/hydroponie_sim/server.py
```

Par défaut, le serveur écoute sur `127.0.0.1:8000`. Laisse ce terminal ouvert pendant les premiers essais. Un jeton de commande est créé au premier lancement dans `labs/hydroponie_sim/.control-token`, avec des permissions locales restrictives ; le fichier est exclu de Git. Le jeton n’est ni un mot de passe Grafana, ni un mot de passe SSH.

Dans un second terminal Alma :

```bash
curl -fsS http://127.0.0.1:8000/api/health
curl -fsS http://127.0.0.1:8000/api/state | python3 -m json.tool
curl -fsS http://127.0.0.1:8000/metrics
```

Le premier appel doit renvoyer `status: ok`. Le deuxième contient la serre, les mesures, les zones, les états de la pompe et de la simulation. Le troisième présente des lignes comme `hydroponie_ph{serre="S001",zone="cuve_nutritive",sens="sortie"} 6.1`.

Tu peux valider le texte avec ton installation Prometheus :

```bash
curl -fsS http://127.0.0.1:8000/metrics | /usr/local/bin/promtool check metrics
```

Ce chemin suppose l’installation du tutoriel. Si le binaire est ailleurs, retrouve-le avec `command -v promtool`.

## 3. Ajouter la cible dans Prometheus

Sauvegarde ta configuration actuelle avant édition. Ajoute le bloc ci-dessous au même niveau que tes jobs existants, sous l’unique clé `scrape_configs:`. Conserve tes lignes `global`, le job Prometheus en 9091 et le Node Exporter.

```yaml
  - job_name: hydroponie_simulation
    scrape_interval: 5s
    metrics_path: /metrics
    static_configs:
      - targets: ['127.0.0.1:8000']
```

Commandes sur Alma :

```bash
sudo cp -n /etc/prometheus/prometheus.yml /etc/prometheus/prometheus.before-hydroponie.yml
sudo nano /etc/prometheus/prometheus.yml
sudo /usr/local/bin/promtool check config /etc/prometheus/prometheus.yml
```

Redémarre seulement si la validation réussit :

```bash
sudo systemctl restart prometheus
sudo systemctl status prometheus --no-pager
```

Dans `http://192.168.0.14:9091/targets`, la cible `hydroponie_simulation` doit être `UP`. Si 9091 n’est pas ouvert sur le réseau, tu peux tester depuis Alma :

```bash
curl -fsSG http://127.0.0.1:9091/api/v1/query --data-urlencode 'query=up{job="hydroponie_simulation"}'
```

La valeur doit être `1`. L’ouverture de 8000 dans firewalld n’est pas nécessaire pour cette collecte locale.

## 4. Importer le dashboard Grafana

Connecte-toi à `http://192.168.0.14:3000`. Dans **Dashboards → New → Import**, importe le fichier `labs/hydroponie_sim/grafana/odyssee-hydroponie.json`. Sélectionne ta source Prometheus existante dans le formulaire puis valide l’import.

Le dashboard comporte 12 panneaux : collecte, pompe, réserve, débit, pH, EC, température de l’eau, pression, température de l’air, humidité, pause et vitesse. Les listes Serre et Zones filtrent les courbes concernées. La plage initiale est de 15 minutes, avec un rafraîchissement de 5 secondes.

Attends deux ou trois collectes pour voir les premières courbes. Aucun historique du fichier `simulation_output.json` n’est importé : les points sont conservés à partir du démarrage de la collecte. Prometheus stocke le temps réel de collecte. La date virtuelle de la simulation n’est pas utilisée comme timestamp Prometheus, même en vitesse ×60.

Si les panneaux restent vides, dans **Explore → Prometheus → Code**, teste :

```promql
up{job="hydroponie_simulation"}
```

puis :

```promql
hydroponie_ph{serre="S001"}
```

## 5. Connecter le front de Jordan

Le front livré est déjà relié à l’API. Il n’utilise plus les anciens objets fixes des pages Dashboard, Simulation, Historique et Crise. Les fichiers de mocks restent disponibles comme référence.

Sur le PC qui exécutera le front, il faut les dépendances habituelles du projet et une version de Node compatible avec Vite : Node 22.12 ou plus récent dans la branche 22 est un choix adapté au verrou fourni.

**Si le front et la simulation tournent tous les deux sur Alma**, conserve le proxy par défaut `127.0.0.1:8000`. Dans le dossier `Front` :

```bash
npm ci
npm run dev -- --host 0.0.0.0
```

Autorise seulement 5173/tcp dans la zone active de firewalld pour que l’équipe accède au front. Dans cet exemple, si la zone active est bien `public` :

```bash
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --permanent --zone=public --add-port=5173/tcp
sudo firewall-cmd --reload
```

Le front sera accessible sur `http://192.168.0.14:5173`. Sa couche Vite transmet les appels `/api` au serveur local en 8000.

**Si Jordan lance le front sur son PC Windows**, stoppe d’abord le serveur de simulation lancé manuellement avec `Ctrl+C`, puis relance-le sur Alma ainsi :

```bash
sudo firewall-cmd --permanent --zone=public --add-port=8000/tcp
sudo firewall-cmd --reload
python3 labs/hydroponie_sim/server.py --host 0.0.0.0 --port 8000
```

Dans `Front/.env.local` sur le PC de Jordan, ajoute :

```ini
ODYSSEE_API_TARGET=http://192.168.0.14:8000
VITE_GRAFANA_URL=http://192.168.0.14:3000/d/odyssee-hydroponie/odyssee-hydroponie
```

Puis, depuis ce dossier `Front` :

```powershell
npm ci
npm run dev
```

Ouvre l’adresse Vite affichée dans son terminal, normalement `http://localhost:5173`. Après modification de `.env.local`, redémarre Vite. Ici `localhost` est le PC de Jordan ; l’adresse de l’API dans le proxy reste celle d’Alma. Cette configuration évite d’ajouter des exceptions CORS pour chaque portable.

Vite est utilisé ici en mode développement. Un futur déploiement permanent devra servir le résultat de `npm run build` et configurer le proxy `/api` côté serveur HTTP. Le proxy Vite de développement ne s’applique pas automatiquement au build.

## 6. Faire une démonstration interactive

Sur Alma, récupère le jeton :

```bash
cat /home/tom/Projet_Odyssee/labs/hydroponie_sim/.control-token
```

Sur la page **Simulation** du front, colle ce jeton dans le champ prévu. Il reste dans l’état de cette page et n’est pas enregistré dans le code ni dans le stockage du navigateur. Ne le colle pas dans Git.

Clique **Arrêter la pompe**. Le débit et la pression passent à zéro ; le dashboard du front reflète cet état au prochain rafraîchissement. Les courbes Grafana le reflètent après la prochaine collecte, puis le rafraîchissement du panneau, soit généralement quelques secondes et jusqu’à environ 10 secondes avec les intervalles de 5 secondes retenus.

Clique **Démarrer la pompe** pour restaurer le débit. Le scénario **Panne de pompe** force l’arrêt même si la demande de marche est active. **Réinitialiser le fonctionnement normal** lève la panne, réinitialise le temps simulé et le petit historique du front. Les anciennes valeurs collectées restent dans Prometheus selon sa rétention.

La pause fige les calculs ; l’API et `/metrics` restent disponibles. **Avancer de 1 seconde** fonctionne uniquement en pause. ×60 réalise 60 pas physiques d’une seconde par seconde réelle ; le dashboard Grafana conserve le temps réel sur son axe horizontal.

**Niveau bas** place la réserve à 30 %. L’appoint automatique prévu dans le code de Dewi peut ensuite la remplir lentement. Il ne s’agit pas d’un modèle d’urgence à eau limitée. Le seuil d’alerte de 40 % est une valeur de démonstration, pas une règle agronomique validée.

## 7. Démarrer automatiquement avec systemd

Une fois les essais validés, arrête l’instance manuelle avec `Ctrl+C`. Vérifie aussi qu’aucun ancien service `hydroponie-sim` ne lance un autre script sur 8000. Deux programmes ne peuvent pas occuper ce port simultanément.

Le fichier de service inclus suppose le compte `tom` et le chemin `/home/tom/Projet_Odyssee`. Adapte-le avant installation si nécessaire :

```bash
sudo cp labs/hydroponie_sim/hydroponie-sim.service /etc/systemd/system/hydroponie-sim.service
sudo systemctl daemon-reload
sudo systemctl enable --now hydroponie-sim
sudo systemctl status hydroponie-sim --no-pager
```

Le service exemple écoute sur toutes les interfaces pour permettre au front d’un collègue de joindre l’API. Si tout tourne sur Alma, remplace `--host 0.0.0.0` par `--host 127.0.0.1`.

Pour les journaux :

```bash
sudo journalctl -u hydroponie-sim -n 40 --no-pager
```

## 8. Intégration future dans le backend FastAPI

Le cœur est déjà dans `backend/app/simulation/live.py`. `labs/hydroponie_sim/server.py` est seulement le lanceur HTTP de laboratoire. L’adaptateur `backend/app/simulation/api.py` permet d’utiliser le même moteur dans FastAPI.

La version livrée de `backend/app/main.py` active cet adaptateur uniquement si `ODYSSEE_ENABLE_SIMULATION=1`. Les autres routes métier sont conservées. Le démarrage du backend complet exige toujours sa configuration MariaDB et ses dépendances habituelles.

Après validation du labo, configure la base avec le vrai `backend/.env`, arrête le labo puis, depuis `backend` et son environnement virtuel :

```bash
export ODYSSEE_ENABLE_SIMULATION=1
export ODYSSEE_SIM_TOKEN_FILE=/home/tom/Projet_Odyssee/labs/hydroponie_sim/.control-token
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

Le front et Prometheus peuvent conserver les mêmes adresses. Le moteur en mémoire impose un seul processus/worker pour ce mode. Pour plusieurs workers ou davantage de serres, il faudra un service de simulation partagé ; il ne faut pas créer une simulation différente par worker. Le jeton de labo devra être remplacé par l’authentification et les rôles du backend avant un déploiement d’exploitation.

MariaDB pourra stocker les plantes, consignes, équipements, scénarios et événements métier. Prometheus conserve les séries temporelles techniques. Une API métier peut consulter les deux selon le besoin du front.

Un lien vers Grafana est déjà présent sur le dashboard React. L’affichage d’un panneau dans une iframe est une étape distincte : Grafana doit autoriser l’intégration et les utilisateurs doivent pouvoir s’authentifier. Aucun accès anonyme n’a été activé dans cette livraison.

## 9. Appliquer la modification dans votre vrai Git

Le patch fourni s’applique au ZIP reçu ; il n’inclut ni environnement virtuel, ni jeton, ni dépendances installées. Dans une copie à jour du dépôt, commence par vérifier les modifications locales avec `git status`. Crée une branche dédiée puis utilise le chemin réel du patch téléchargé :

```bash
git switch -c integration/hydroponie-live
git apply --check /chemin/odyssee-hydroponie.patch
git apply /chemin/odyssee-hydroponie.patch
git diff --check
```

Si `git apply --check` échoue, la branche a divergé du ZIP : compare les fichiers concernés avant toute copie. N’écrase pas les changements récents de Dewi ou Jordan. Après revue et tests, vous pouvez committer et pousser cette branche avec vos accès GitHub habituels.

## Limites et vérification

Neuf tests automatiques du moteur et du serveur HTTP ont été exécutés : pause, pas manuel, accélération, commande de pompe, panne, niveau bas, bornes d’historique, conversion d’unités et refus des commandes non authentifiées ou invalides. Les 16 fichiers JavaScript/JSX du front et de sa configuration ont été transformés pour vérifier leur syntaxe. Les métriques référencées dans le dashboard ont été comparées à celles réellement exposées.

Les installations de paquets sont bloquées dans l’environnement de préparation : l’essai `npm ci` a reçu un refus réseau HTTP 403, et les paquets Python nécessaires à FastAPI n’étaient pas disponibles. Le build Vite complet, le démarrage de FastAPI avec MariaDB et l’import visuel dans une instance Grafana n’ont donc pas été exécutés ici. Les étapes 3 à 6 restent les contrôles d’intégration à effectuer sur vos machines ; aucun déploiement n’a été réalisé sur Alma à distance.

Le modèle physique reste simplifié : retour d’EC seulement vers la réserve, niveau de cuve repris de la réserve, appoint sans stock source limité, dynamique chimique non validée, absence de bilan énergétique ou de croissance des plantes. L’arrêt de pompe est matérialisé par débit et pression nuls ; il ne modélise pas encore la stagnation de chaque conduite. L’ancien `backend/run_simulation.py` reste un export par lot ; le service continu est le lanceur à utiliser pour le labo.

Le bruit annoncé comme borné était gaussien non borné dans le code d’origine : il est maintenant limité à l’amplitude indiquée. Le niveau de la réserve est plafonné à sa capacité configurée. Le nouveau service impose un pas de calcul d’une seconde, car plusieurs fonctions d’origine ne tenaient pas compte de `dt` dans leurs corrections.

Références officielles : [format d’exposition Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/), [conventions de métriques](https://prometheus.io/docs/practices/naming/), [import de dashboards Grafana](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/import-dashboards/), [proxy Vite](https://vite.dev/config/server-options.html), [cycle de vie FastAPI](https://fastapi.tiangolo.com/advanced/events/).
