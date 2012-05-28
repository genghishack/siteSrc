-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 17, 2010 at 06:44 PM
-- Server version: 5.1.44
-- PHP Version: 5.3.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `siteSrc`
--

-- --------------------------------------------------------

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `group`
--

INSERT INTO `group` VALUES(1, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `group_x_priv`
--

DROP TABLE IF EXISTS `group_x_priv`;
CREATE TABLE `group_x_priv` (
  `user_id` int(11) NOT NULL,
  `priv_id` int(11) NOT NULL,
  KEY `user_id` (`user_id`,`priv_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `group_x_priv`
--

INSERT INTO `group_x_priv` VALUES(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `priv`
--

DROP TABLE IF EXISTS `priv`;
CREATE TABLE `priv` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `priv`
--

INSERT INTO `priv` VALUES(1, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` VALUES(1, 'admin', '21232f297a57a5a743894a0e4a801fc3', 'genghishack@gmail.com', 1);
INSERT INTO `user` VALUES(4, 'test', '098f6bcd4621d373cade4e832627b4f6', '', 0);

