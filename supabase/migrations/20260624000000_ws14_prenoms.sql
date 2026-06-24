create table ws14_prenoms (
  id bigint generated always as identity primary key,
  prenom text not null,
  genre text not null check (genre in ('fille', 'garcon', 'mixte'))
);

insert into ws14_prenoms (prenom, genre) values
-- Filles
('Emma', 'fille'), ('Léa', 'fille'), ('Chloé', 'fille'), ('Inès', 'fille'),
('Manon', 'fille'), ('Jade', 'fille'), ('Louise', 'fille'), ('Alice', 'fille'),
('Lola', 'fille'), ('Zoé', 'fille'), ('Clara', 'fille'), ('Eva', 'fille'),
('Anaïs', 'fille'), ('Lucie', 'fille'), ('Sarah', 'fille'), ('Juliette', 'fille'),
('Mathilde', 'fille'), ('Océane', 'fille'), ('Pauline', 'fille'), ('Margot', 'fille'),
('Charlotte', 'fille'), ('Sofia', 'fille'), ('Ambre', 'fille'), ('Lily', 'fille'),
('Noémie', 'fille'), ('Romane', 'fille'), ('Clémence', 'fille'), ('Agathe', 'fille'),
('Valentine', 'fille'), ('Iris', 'fille'), ('Nina', 'fille'), ('Capucine', 'fille'),
('Adèle', 'fille'), ('Stella', 'fille'), ('Elisa', 'fille'), ('Maëlys', 'fille'),
('Clémentine', 'fille'), ('Victoire', 'fille'), ('Héloïse', 'fille'), ('Céleste', 'fille'),
-- Garçons
('Lucas', 'garcon'), ('Nathan', 'garcon'), ('Hugo', 'garcon'), ('Théo', 'garcon'),
('Tom', 'garcon'), ('Louis', 'garcon'), ('Enzo', 'garcon'), ('Mathis', 'garcon'),
('Ethan', 'garcon'), ('Noah', 'garcon'), ('Gabriel', 'garcon'), ('Raphaël', 'garcon'),
('Arthur', 'garcon'), ('Jules', 'garcon'), ('Paul', 'garcon'), ('Adam', 'garcon'),
('Axel', 'garcon'), ('Baptiste', 'garcon'), ('Maxime', 'garcon'), ('Simon', 'garcon'),
('Tristan', 'garcon'), ('Victor', 'garcon'), ('Luca', 'garcon'), ('Matteo', 'garcon'),
('Antoine', 'garcon'), ('Benjamin', 'garcon'), ('Charles', 'garcon'), ('Florian', 'garcon'),
('Julien', 'garcon'), ('Léon', 'garcon'), ('Oscar', 'garcon'), ('Romain', 'garcon'),
('Samuel', 'garcon'), ('Thibault', 'garcon'), ('Valentin', 'garcon'), ('Yanis', 'garcon'),
('Nino', 'garcon'), ('Côme', 'garcon'), ('Gaspard', 'garcon'), ('Hippolyte', 'garcon'),
-- Mixtes
('Camille', 'mixte'), ('Alex', 'mixte'), ('Charlie', 'mixte'), ('Lou', 'mixte'),
('Sacha', 'mixte'), ('Eden', 'mixte'), ('Noa', 'mixte'), ('Morgan', 'mixte'),
('Ange', 'mixte'), ('Elliot', 'mixte');
