-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 20, 2010 at 11:21 PM
-- Server version: 5.1.44
-- PHP Version: 5.3.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `genghishack`
--

-- --------------------------------------------------------

--
-- Table structure for table `likedudeman`
--

CREATE TABLE `likedudeman` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_added` date NOT NULL,
  `date_drawn` date DEFAULT NULL,
  `image` blob NOT NULL,
  `caption_text` text NOT NULL,
  `sequence` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `bytes` int(11) NOT NULL,
  `mime_type` varchar(30) NOT NULL,
  `filename` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `likedudeman`
--


