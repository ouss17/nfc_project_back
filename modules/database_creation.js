const createDatabase = (con) => {
    let query = `
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : oussdiyrsmane.mysql.db
-- Généré le : mer. 25 déc. 2024 à 12:36
-- Version du serveur : 8.0.39-30
-- Version de PHP : 8.2.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : oussdiyrsmane
--

-- --------------------------------------------------------

--
-- Structure de la table availablePrices
--

CREATE TABLE IF NOT EXISTS availablePrices (
  id int NOT NULL,
  amount smallint NOT NULL,
  isAvailable tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table paiementsHistoric
--

CREATE TABLE IF NOT EXISTS paiementsHistoric (
  id int NOT NULL,
  amount decimal(10,0) NOT NULL,
  firstname varchar(100) NOT NULL,
  lastname varchar(100) DEFAULT NULL,
  email varchar(150) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table projects
--

CREATE TABLE IF NOT EXISTS projects (
  id int NOT NULL,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  isAvailable tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table section
--

CREATE TABLE IF NOT EXISTS section (
  id int NOT NULL,
  title varchar(255) DEFAULT NULL,
  content text NOT NULL,
  images text,
  idProject int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table users
--

CREATE TABLE IF NOT EXISTS users (
  id int NOT NULL,
  pseudo varchar(50) NOT NULL,
  email varchar(150) NOT NULL,
  password varchar(255) NOT NULL,
  firstname varchar(50) NOT NULL,
  lastname varchar(50) NOT NULL,
  role enum('user','admin') NOT NULL DEFAULT 'user',
  creation_timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table availablePrices
--
ALTER TABLE availablePrices
  ADD PRIMARY KEY (id);

--
-- Index pour la table paiementsHistoric
--
ALTER TABLE paiementsHistoric
  ADD PRIMARY KEY (id);

--
-- Index pour la table projects
--
ALTER TABLE projects
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY title (title);

--
-- Index pour la table section
--
ALTER TABLE section
  ADD PRIMARY KEY (id),
  ADD KEY idProject (idProject);

--
-- Index pour la table users
--
ALTER TABLE users
  ADD PRIMARY KEY (id),
  ADD UNIQUE KEY email (email),
  ADD UNIQUE KEY pseudo (pseudo);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table availablePrices
--
ALTER TABLE availablePrices
  MODIFY id int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table paiementsHistoric
--
ALTER TABLE paiementsHistoric
  MODIFY id int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table projects
--
ALTER TABLE projects
  MODIFY id int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table section
--
ALTER TABLE section
  MODIFY id int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table users
--
ALTER TABLE users
  MODIFY id int NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table section
--
ALTER TABLE section
  ADD CONSTRAINT section_ibfk_1 FOREIGN KEY (idProject) REFERENCES projects (id) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


    `;

    con.query(query, (err, rows) => {
        if (err) return console.error("Table Creation Failed", err);

        console.log(`Successfully Created Table`);
    });
};

module.exports = { createDatabase };
