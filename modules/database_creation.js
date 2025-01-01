const createDatabase = (con) => {
  let query = `
-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 28 déc. 2024 à 06:39
-- Version du serveur :  10.4.13-MariaDB
-- Version de PHP : 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : borne_project
--

-- --------------------------------------------------------

--
-- Structure de la table availablePrices
--

CREATE TABLE IF NOT EXISTS availablePrices (
  id int(11) NOT NULL AUTO_INCREMENT,
  amount smallint(6) NOT NULL,
  isAvailable tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table paiementsHistoric
--

CREATE TABLE IF NOT EXISTS paiementsHistoric (
  id int(11) NOT NULL AUTO_INCREMENT,
  amount decimal(10,0) NOT NULL,
  firstname varchar(100) NOT NULL,
  lastname varchar(100) DEFAULT NULL,
  email varchar(150) DEFAULT NULL,
  creation_timestamp datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table projects
--

CREATE TABLE IF NOT EXISTS projects (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  isAvailable tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table section
--

CREATE TABLE IF NOT EXISTS section (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) DEFAULT NULL,
  content text NOT NULL,
  images text DEFAULT NULL,
  idProject int(11) NOT NULL,
  PRIMARY KEY (id),
  KEY idProject (idProject)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table users
--

CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL AUTO_INCREMENT,
  pseudo varchar(50) NOT NULL,
  email varchar(150) NOT NULL,
  password varchar(255) NOT NULL,
  firstname varchar(50) DEFAULT NULL,
  lastname varchar(50) DEFAULT NULL,
  role enum('user','admin') NOT NULL DEFAULT 'user',
  creation_timestamp datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  UNIQUE KEY pseudo (pseudo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
