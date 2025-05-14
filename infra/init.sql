CREATE TABLE Aluno (
id_aluno SERIAL PRIMARY KEY,
nome_inteiro VARCHAR(100) NOT NULL,
cpf VARCHAR(11) UNIQUE NOT NULL,
email VARCHAR(80),
celular VARCHAR(20) NOT NULL,
status_aluno BOOLEAN DEFAULT TRUE
);

CREATE TABLE Curso (
id_curso SERIAL PRIMARY KEY,
nome VARCHAR(150) NOT NULL,
area VARCHAR(100) NOT NULL,
carga_horaria VARCHAR(5) NOT NULL,
status_curso BOOLEAN DEFAULT TRUE
);

CREATE TABLE Matricula (
id_matricula SERIAL PRIMARY KEY,
id_aluno INT NOT NULL REFERENCES Aluno(id_aluno),
id_curso INT NOT NULL REFERENCES Curso(id_curso),
data_matricula DATE,
status_matricula BOOLEAN DEFAULT ATIVA
);

CREATE TABLE Usuario (
id_vestuario SERIAL PRIMARY KEY,
login VARCHAR(100) UNIQUE NOT NULL,
senha VARCHAR NOT NULL
);

-- Inserções para a tabela Aluno
INSERT INTO Aluno (nome_inteiro, cpf, email, celular) VALUES 
('Carlos Alberto da Silva', '12345678901', 'carlos.silva@email.com', '11999990000'),
('Maria Fernanda Oliveira', '98765432100', 'maria.fernanda@email.com', '11988887777'),
('João Pedro Lima', '11122233344', 'joao.lima@email.com', '11977776666');

-- Inserções para a tabela Curso
INSERT INTO Curso (nome, area, carga_horaria) VALUES 
('Engenharia de Software', 'Tecnologia da Informação', '3600'),
('Administração de Empresas', 'Gestão', '3200'),
('Design Gráfico', 'Comunicação Visual', '2800');

-- Inserções para a tabela Matricula
INSERT INTO Matricula (id_aluno, id_curso, data_matricula, status_matricula) VALUES 
(1, 1, '2024-03-01', 'Ativa'),
(2, 2, '2024-04-15', 'Ativa'),
(3, 3, '2024-05-10', 'Pendente');

-- Inserções para a tabela Usuario
INSERT INTO Usuario (login, senha) VALUES 
('carlos.silva', 'senha123'),
('maria.fernanda', '123senha'),
('joao.lima', 'limajoao@2024');

