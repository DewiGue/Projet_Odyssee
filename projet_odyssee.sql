-- phpMyAdmin SQL Dump
-- version 5.2.3-1.fc41.remi
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : jeu. 24 sep. 2026 à 15:15
-- Version du serveur : 10.11.11-MariaDB
-- Version de PHP : 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projet_odyssee`
--

-- --------------------------------------------------------

--
-- Structure de la table `Plant`
--

CREATE TABLE `Plant` (
  `Id_Plant` int(11) NOT NULL,
  `date_semis` date DEFAULT NULL,
  `date_plantation` date DEFAULT NULL,
  `date_recolte_prevue` date DEFAULT NULL,
  `quantite` decimal(10,3) DEFAULT NULL,
  `unite_quantite` varchar(20) DEFAULT NULL,
  `statut` varchar(30) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `Id_Type` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Plant`
--

INSERT INTO `Plant` (`Id_Plant`, `date_semis`, `date_plantation`, `date_recolte_prevue`, `quantite`, `unite_quantite`, `statut`, `notes`, `created_at`, `updated_at`, `Id_Type`) VALUES
(1, '2026-09-18', NULL, NULL, 200.000, 'unite', 'Semis', 'Semis en godets, à repiquer sous 10 jours', '2026-09-18 09:00:00', '2026-09-18 09:00:00', 1),
(2, '2026-09-20', NULL, NULL, 150.000, 'unite', 'Semis', NULL, '2026-09-20 09:00:00', '2026-09-20 09:00:00', 4),
(3, '2026-09-19', NULL, NULL, 100.000, 'unite', 'Semis', 'Lot test pour le module NFT n°2', '2026-09-19 10:30:00', '2026-09-19 10:30:00', 8),
(4, '2026-09-21', NULL, NULL, 80.000, 'unite', 'Semis', NULL, '2026-09-21 08:15:00', '2026-09-21 08:15:00', 13),
(5, '2026-08-25', '2026-09-05', '2026-10-05', 60.000, 'unite', 'Croissance', NULL, '2026-08-25 09:00:00', '2026-09-05 09:00:00', 1),
(6, '2026-08-20', '2026-09-01', '2026-11-14', 20.000, 'unite', 'Croissance', 'Croissance un peu lente, à surveiller', '2026-08-20 09:00:00', '2026-09-15 09:00:00', 5),
(7, '2026-08-28', '2026-09-08', '2026-10-13', 30.000, 'unite', 'Croissance', NULL, '2026-08-28 09:00:00', '2026-09-08 09:00:00', 7),
(8, '2026-09-01', '2026-09-12', '2026-10-12', 40.000, 'unite', 'Croissance', NULL, '2026-09-01 09:00:00', '2026-09-12 09:00:00', 9),
(9, '2026-08-30', '2026-09-10', '2026-10-20', 25.000, 'unite', 'Croissance', 'Bac aéroponie, module 2', '2026-08-30 09:00:00', '2026-09-10 09:00:00', 14),
(10, '2026-08-15', '2026-08-26', '2026-10-25', 15.000, 'unite', 'Croissance', NULL, '2026-08-15 09:00:00', '2026-08-26 09:00:00', 12),
(11, '2026-07-20', '2026-07-31', '2026-10-13', 18.000, 'unite', 'Croissance', 'Premiers bouquets floraux visibles', '2026-07-20 09:00:00', '2026-09-20 09:00:00', 4),
(12, '2026-07-15', '2026-07-26', '2026-10-18', 12.000, 'unite', 'Croissance', NULL, '2026-07-15 09:00:00', '2026-09-18 09:00:00', 6),
(13, '2026-08-01', '2026-08-12', '2026-10-06', 22.000, 'unite', 'Croissance', NULL, '2026-08-01 09:00:00', '2026-09-19 09:00:00', 7),
(14, '2026-07-10', '2026-07-21', '2026-10-09', 10.000, 'unite', 'Malade', 'Pollinisation manuelle en cours', '2026-07-10 09:00:00', '2026-09-17 09:00:00', 12),
(15, '2026-06-01', '2026-06-12', '2026-07-17', 4.200, 'kg', 'Récolte', 'Récolte légèrement en dessous de la moyenne', '2026-06-01 09:00:00', '2026-07-17 16:00:00', 1),
(16, '2026-06-05', '2026-06-16', '2026-07-16', 3.800, 'kg', 'Récolte', NULL, '2026-06-05 09:00:00', '2026-07-16 16:00:00', 2),
(17, '2026-05-10', '2026-05-21', '2026-08-03', 6.500, 'kg', 'Récolte', 'Bonne récolte, RAS', '2026-05-10 09:00:00', '2026-08-03 16:00:00', 5),
(18, '2026-06-10', '2026-06-21', '2026-08-15', 11.300, 'kg', 'Récolte', NULL, '2026-06-10 09:00:00', '2026-08-15 16:00:00', 7),
(19, '2026-07-01', '2026-07-12', '2026-08-09', 2.100, 'kg', 'Récolte', 'Récolte partielle, reste sur pied', '2026-07-01 09:00:00', '2026-08-09 16:00:00', 8),
(20, NULL, NULL, NULL, NULL, NULL, 'Vide', NULL, '2026-06-15 09:00:00', '2026-08-25 16:00:00', NULL),
(21, NULL, NULL, NULL, NULL, NULL, 'Vide', NULL, '2026-04-01 09:00:00', '2026-05-20 09:00:00', NULL),
(22, NULL, NULL, NULL, NULL, NULL, 'Vide', NULL, '2026-03-15 09:00:00', '2026-06-22 09:00:00', NULL),
(23, NULL, NULL, NULL, NULL, NULL, 'Vide', NULL, '2026-04-10 09:00:00', '2026-05-28 09:00:00', NULL),
(24, NULL, NULL, NULL, NULL, NULL, 'Vide', NULL, '2026-02-01 09:00:00', '2026-03-26 09:00:00', NULL),
(25, NULL, NULL, NULL, NULL, NULL, 'Vide', NULL, '2026-03-01 09:00:00', '2026-05-13 09:00:00', NULL),
(26, NULL, NULL, NULL, NULL, NULL, 'Vide', NULL, '2026-01-15 09:00:00', '2026-03-09 09:00:00', NULL);

--
-- Déclencheurs `Plant`
--
DELIMITER $$
CREATE TRIGGER `plant_vide_before_update` BEFORE UPDATE ON `Plant` FOR EACH ROW BEGIN
  IF NEW.statut = 'Vide' THEN
    SET NEW.Id_Type = NULL;
    SET NEW.date_semis = NULL;
    SET NEW.date_plantation = NULL;
    SET NEW.date_recolte_prevue = NULL;
    SET NEW.quantite = NULL;
    SET NEW.unite_quantite = NULL;
    IF OLD.notes != NULL THEN
      SET NEW.notes = NULL;
    END IF;
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Type`
--

CREATE TABLE `Type` (
  `Id_Type` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `variete` varchar(100) DEFAULT NULL,
  `systeme_culture` varchar(30) NOT NULL,
  `ph_min` decimal(4,2) NOT NULL,
  `ph_max` decimal(4,2) NOT NULL,
  `ec_min` decimal(5,2) NOT NULL,
  `ec_max` decimal(5,2) NOT NULL,
  `temp_eau_min` decimal(5,2) NOT NULL,
  `temp_eau_max` decimal(5,2) NOT NULL,
  `temp_air_min` decimal(5,2) NOT NULL,
  `temp_air_max` decimal(5,2) NOT NULL,
  `famille` varchar(100) NOT NULL,
  `humidite_min` decimal(5,2) NOT NULL,
  `humidite_max` decimal(5,2) NOT NULL,
  `co2_min` decimal(8,2) DEFAULT NULL,
  `co2_max` decimal(8,2) DEFAULT NULL,
  `ppfd_min` decimal(8,2) DEFAULT NULL,
  `ppfd_max` decimal(8,2) DEFAULT NULL,
  `photoperiode_heures` decimal(4,2) DEFAULT NULL,
  `cycle_culture_jours` int(11) DEFAULT NULL,
  `rendement_min_kg_m2` decimal(8,3) DEFAULT NULL,
  `rendement_max_kg_m2` decimal(8,3) DEFAULT NULL,
  `besoin_eau_l_kg` decimal(8,2) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `actif` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Type`
--

INSERT INTO `Type` (`Id_Type`, `nom`, `variete`, `systeme_culture`, `ph_min`, `ph_max`, `ec_min`, `ec_max`, `temp_eau_min`, `temp_eau_max`, `temp_air_min`, `temp_air_max`, `famille`, `humidite_min`, `humidite_max`, `co2_min`, `co2_max`, `ppfd_min`, `ppfd_max`, `photoperiode_heures`, `cycle_culture_jours`, `rendement_min_kg_m2`, `rendement_max_kg_m2`, `besoin_eau_l_kg`, `created_at`, `updated_at`, `actif`) VALUES
(1, 'Laitue', 'Romaine', 'NFT', 5.50, 6.50, 0.80, 1.60, 18.00, 22.00, 16.00, 24.00, 'Asteracees', 55.00, 70.00, 400.00, 800.00, 150.00, 250.00, 16.00, 35, 3.500, 5.000, 20.00, '2026-08-01 08:00:00', '2026-08-01 08:00:00', 1),
(2, 'Laitue', 'Batavia', 'NFT', 5.50, 6.50, 0.80, 1.60, 18.00, 22.00, 16.00, 24.00, 'Asteracees', 55.00, 70.00, 400.00, 800.00, 150.00, 250.00, 16.00, 32, 3.200, 4.800, 19.00, '2026-08-01 08:00:00', '2026-08-01 08:00:00', 1),
(3, 'Laitue', 'Feuille de chêne', 'NFT', 5.50, 6.50, 0.80, 1.60, 18.00, 22.00, 16.00, 24.00, 'Asteracees', 55.00, 70.00, 400.00, 800.00, 150.00, 250.00, 16.00, 34, 3.000, 4.500, 20.00, '2026-08-01 08:00:00', '2026-08-01 08:00:00', 1),
(4, 'Tomate', 'Cerise', 'substrat', 5.80, 6.30, 2.00, 3.50, 18.00, 24.00, 18.00, 28.00, 'Solanacees', 60.00, 75.00, 700.00, 1200.00, 400.00, 700.00, 14.00, 75, 4.000, 7.000, 45.00, '2026-08-02 08:00:00', '2026-08-02 08:00:00', 1),
(5, 'Tomate', 'Cœur de bœuf', 'substrat', 5.80, 6.30, 2.20, 3.80, 18.00, 24.00, 18.00, 28.00, 'Solanacees', 60.00, 75.00, 700.00, 1200.00, 400.00, 700.00, 14.00, 85, 5.000, 8.500, 50.00, '2026-08-02 08:00:00', '2026-08-02 08:00:00', 1),
(6, 'Poivron', 'Doux rouge', 'substrat', 5.80, 6.30, 2.00, 3.20, 20.00, 25.00, 20.00, 28.00, 'Solanacees', 60.00, 75.00, 700.00, 1200.00, 350.00, 650.00, 14.00, 90, 3.000, 5.500, 40.00, '2026-08-03 08:00:00', '2026-08-03 08:00:00', 1),
(7, 'Concombre', 'Long hollandais', 'substrat', 5.50, 6.00, 1.80, 2.80, 20.00, 24.00, 20.00, 28.00, 'Cucurbitacees', 65.00, 80.00, 700.00, 1300.00, 350.00, 650.00, 14.00, 55, 8.000, 14.000, 35.00, '2026-08-03 08:00:00', '2026-08-03 08:00:00', 1),
(8, 'Basilic', 'Grand vert', 'DWC', 5.50, 6.50, 1.00, 1.80, 20.00, 24.00, 20.00, 28.00, 'Lamiacees', 50.00, 65.00, 400.00, 800.00, 200.00, 400.00, 16.00, 28, 1.500, 2.800, 18.00, '2026-08-04 08:00:00', '2026-08-04 08:00:00', 1),
(9, 'Basilic', 'Pourpre', 'DWC', 5.50, 6.50, 1.00, 1.80, 20.00, 24.00, 20.00, 28.00, 'Lamiacees', 50.00, 65.00, 400.00, 800.00, 200.00, 400.00, 16.00, 30, 1.300, 2.500, 18.00, '2026-08-04 08:00:00', '2026-08-04 08:00:00', 1),
(10, 'Menthe', 'Verte', 'DWC', 5.50, 6.50, 1.00, 1.80, 18.00, 22.00, 16.00, 26.00, 'Lamiacees', 55.00, 70.00, 400.00, 800.00, 150.00, 350.00, 16.00, 40, 1.800, 3.000, 17.00, '2026-08-04 08:00:00', '2026-08-04 08:00:00', 1),
(11, 'Persil', 'Frisé', 'DWC', 5.50, 6.50, 0.90, 1.60, 18.00, 22.00, 16.00, 24.00, 'Apiacees', 55.00, 70.00, 400.00, 800.00, 150.00, 350.00, 14.00, 45, 1.200, 2.200, 16.00, '2026-08-05 08:00:00', '2026-08-05 08:00:00', 1),
(12, 'Fraise', 'Gariguette', 'substrat', 5.50, 6.20, 1.20, 2.00, 16.00, 20.00, 15.00, 24.00, 'Rosacees', 60.00, 75.00, NULL, NULL, 250.00, 450.00, 12.00, 60, 1.500, 3.000, 25.00, '2026-08-05 08:00:00', '2026-08-05 08:00:00', 1),
(13, 'Chou kale', 'Frisé vert', 'aeroponie', 5.50, 6.50, 1.50, 2.50, 16.00, 20.00, 15.00, 22.00, 'Brassicacees', 55.00, 70.00, 400.00, 800.00, 150.00, 300.00, 14.00, 50, 2.500, 4.000, 22.00, '2026-08-06 08:00:00', '2026-08-06 08:00:00', 1),
(14, 'Épinard', 'Géant d\'hiver', 'aeroponie', 6.00, 7.00, 1.80, 2.30, 16.00, 20.00, 14.00, 20.00, 'Chenopodiacees', 55.00, 70.00, NULL, NULL, 150.00, 300.00, 12.00, 40, 2.000, 3.500, 20.00, '2026-08-06 08:00:00', '2026-08-06 08:00:00', 1);

-- --------------------------------------------------------

--
-- Structure de la table `Users`
--

CREATE TABLE `Users` (
  `Id_Users` int(11) NOT NULL,
  `numero_membre` int(11) NOT NULL,
  `mot_de_passe` text NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Plant`
--
ALTER TABLE `Plant`
  ADD PRIMARY KEY (`Id_Plant`),
  ADD KEY `Id_Type` (`Id_Type`);

--
-- Index pour la table `Type`
--
ALTER TABLE `Type`
  ADD PRIMARY KEY (`Id_Type`);

--
-- Index pour la table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`Id_Users`),
  ADD UNIQUE KEY `numero_membre` (`numero_membre`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Plant`
--
ALTER TABLE `Plant`
  MODIFY `Id_Plant` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `Type`
--
ALTER TABLE `Type`
  MODIFY `Id_Type` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `Users`
--
ALTER TABLE `Users`
  MODIFY `Id_Users` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Plant`
--
ALTER TABLE `Plant`
  ADD CONSTRAINT `Plant_ibfk_1` FOREIGN KEY (`Id_Type`) REFERENCES `Type` (`Id_Type`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
