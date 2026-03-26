-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2026 at 11:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `teacher_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(50) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `details`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 6, 'create_teacher', 'Created teacher: roy singh (ID: 4)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-26 10:05:41'),
(2, 6, 'login', 'User logged in from IP: ::1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', '2026-03-26 10:06:28');

-- --------------------------------------------------------

--
-- Table structure for table `auth_user`
--

CREATE TABLE `auth_user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `auth_user`
--

INSERT INTO `auth_user` (`id`, `email`, `first_name`, `last_name`, `password`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(1, 'test@example.com', 'John', 'Doe', '$2y$10$2ztR.7SxNU.m/Twd2rBUS.OAbbHdRW4hH9DPuj/ddW/PMWxPd/pVe', '1234567890', 1, '2026-03-26 02:00:59', '2026-03-26 02:00:59'),
(2, 'testapi@example.com', 'API', 'Test', '$2y$10$YpXEDfG/LaDJobuFdjvUau4tMS9VpGQjAS7rfa6X50s1CJZzTLgq6', '1234567890', 1, '2026-03-26 02:19:46', '2026-03-26 02:19:46'),
(3, 'reactfinal@example.com', 'John', 'Doe', '$2y$10$bOLmchjL3SZaWI8TkFaZsuG.oHrU46s4ZR58TOAOLlBpn.OHz5b4.', '1234567890', 1, '2026-03-26 02:20:45', '2026-03-26 02:20:45'),
(4, 'jane@example.com', 'Updated', 'Name', '$2y$10$VwLgpFjlx2dz3GBw7JkQ.u.lwyrMTV1Y3.7rWeF7dOW8NxmEWDCKi', '1234567890', 1, '2026-03-26 02:24:48', '2026-03-26 03:28:17'),
(5, 'sarah@example.com', 'Sarah', 'Johnson', '$2y$10$h8pbsGkwakkya9Dji9WGw.5g1QIydG7GPa6FjLuEWNE7RlH0l0zpq', '9876543210', 1, '2026-03-26 02:28:40', '2026-03-26 02:28:40'),
(6, 'sasi@example.com', 'sasi', 'chintada', '$2y$10$12d8FbFEsIIgKr0QWeWLquSktXWCte1hIkAn1sENk.8mFtducG7B2', '', 1, '2026-03-26 03:55:04', '2026-03-26 03:55:04'),
(7, 'sasi_test@example.com', 'sasi', 'chintada', '$2y$10$.CgedZuiT5f9gTFZUQ1CIeg91gB8yiFV7lybYRmPqn0IadmYC2O2i', '2123890183', 1, '2026-03-26 04:19:44', '2026-03-26 04:19:44'),
(8, 'sasi_test2@example.com', 'roy', 'singh', '$2y$10$4E8VssHhFsyn4WS0mBWeiOilEgDGB.JKZJIgGBiWqdZhwV3beMqoq', '23874-207193', 1, '2026-03-26 04:35:40', '2026-03-26 04:35:40');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `university_name` varchar(255) NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `year_joined` year(4) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `user_id`, `university_name`, `gender`, `year_joined`, `department`, `designation`, `qualification`, `created_at`, `updated_at`) VALUES
(1, 4, 'Updated University', 'male', '2020', 'Computer Science', ' Professor', 'PhD', '2026-03-26 02:24:48', '2026-03-26 03:28:17'),
(2, 5, 'Stanford University', 'female', '2021', 'Mathematics', 'Associate Professor', 'PhD', '2026-03-26 02:28:40', '2026-03-26 02:28:40'),
(3, 7, 'vishnu', 'male', '2021', 'physics', 'professor', 'Masters', '2026-03-26 04:19:44', '2026-03-26 04:19:44'),
(4, 8, 'oxford', 'male', '2023', 'chemistry', 'professor', 'PhD', '2026-03-26 04:35:41', '2026-03-26 04:35:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `auth_user`
--
ALTER TABLE `auth_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `auth_user`
--
ALTER TABLE `auth_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
