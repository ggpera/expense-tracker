CREATE TABLE IF NOT EXISTS `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` DATE DEFAULT NULL,
  `amount` DECIMAL(8,2) DEFAULT NULL,
  `category` varchar(60) NOT NULL,
  `shop` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `expenses` (`date`, `amount`, `category`, `shop`) VALUES ('2022-12-21', 100.00, "Ruoka", "Prisma");
INSERT INTO `expenses` (`date`, `amount`, `category`, `shop`) VALUES ('2022-12-22', 220.45, "Bensa", "Neste");
INSERT INTO `expenses` (`date`, `amount`, `category`, `shop`) VALUES ('2022-12-22', 4.99, "Suoratoisto", "Tidal");

ALTER TABLE expenses AUTO_INCREMENT = 0;