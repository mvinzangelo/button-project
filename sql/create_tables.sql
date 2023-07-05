CREATE TABLE student (
  id serial,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
);

/*
 one to many: Book has many reviews
*/

DROP TABLE IF EXISTS button_press;
CREATE TABLE button_press (
  id serial,
  student_id int NOT NULL,
  time_pressed timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
);