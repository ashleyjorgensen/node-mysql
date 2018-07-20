create database aj_db;

use aj_db;

create table music (
	id integer(10) not null auto_increment,
	title varchar(50),
    artist varchar(50),
    genre varchar(50),
    primary key(id)
    );
    
insert into music (title, artist, genre) values ("delicate", "taylor swift", "pop");
insert into music (title, artist, genre) values ("perfect", "ed sherean", "pop");
insert into music (title, artist, genre) values ("gods plan", "drake", "rap");
insert into music (title, artist, genre) values ("ring of fire", "johnny cash", "rock");

