import { DataBaseModel } from "./DataBaseModel";

// Recupera a conexão com o banco de dados
const database = new DataBaseModel().pool;

/**
 * Classe que representa um Curso no sistema.
 */
export class Curso {
    
    private idCurso: number = 0; // Identificador único do curso
    private nome: string; // Nome do curso
    private area: string; // Área de conhecimento do curso
    private cargaHoraria: number; // Carga horária total do curso
    private statusCurso: boolean = true; // Status do curso (ativo ou inativo)

    /**
     * Construtor da classe Curso
     * 
     * @param _nome - Nome do Curso
     * @param _area - Área do Curso
     * @param _cargaHoraria - Carga horária do Curso
     */
    public constructor(_nome: string, _area: string, _cargaHoraria: number) {
        this.nome = _nome;
        this.area = _area;
        this.cargaHoraria = _cargaHoraria;
    }

    // ===== GETTERS E SETTERS =====

    public getIdCurso(): number {
        return this.idCurso;
    }

    public setIdCurso(_idCurso: number): void {
        this.idCurso = _idCurso;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    public getArea(): string {
        return this.area;
    }

    public setArea(_area: string): void {
        this.area = _area;
    }

    public getCargaHoraria(): number {
        return this.cargaHoraria;
    }

    public setCargaHoraria(_cargaHoraria: number): void {
        this.cargaHoraria = _cargaHoraria;
    }

    public getStatusCurso(): boolean {
        return this.statusCurso;
    }

    public setStatusCurso(_statusCurso: boolean) {
        this.statusCurso = _statusCurso;
    }

    /**
     * Retorna a lista de cursos ativos cadastrados no sistema.
     * 
     * @returns Um array de objetos do tipo Curso ou null em caso de erro.
     */
    static async listagemCursos(): Promise<Array<Curso> | null> {
        const listaDeCursos: Array<Curso> = [];
        try {
            const querySelectCursos = `SELECT * FROM Curso WHERE status_curso = true;`;
            const respostaBD = await database.query(querySelectCursos);

            respostaBD.rows.forEach((linha) => {
                const novoCurso = new Curso(
                    linha.nome,
                    linha.area,
                    linha.carga_horaria
                );
                novoCurso.setIdCurso(linha.id_curso);
                novoCurso.setStatusCurso(linha.status_curso);
                listaDeCursos.push(novoCurso);
            });

            return listaDeCursos;
        } catch (error) {
            console.log('Erro ao buscar lista de cursos');
            return null;
        }
    }

    /**
     * Cadastra um novo curso no banco de dados.
     * 
     * @param curso - Objeto Curso com os dados a serem inseridos
     * @returns true se o cadastro foi realizado com sucesso, false caso contrário
     */
    static async cadastroCurso(curso: Curso): Promise<boolean> {
        try {
            const queryInsertCurso = `INSERT INTO Curso (nome, area, carga_horaria) VALUES
                                    ('${curso.getNome()}', 
                                    '${curso.getArea()}',
                                    '${curso.getCargaHoraria()}')
                                    RETURNING id_curso;`;

            const respostaBD = await database.query(queryInsertCurso);

            if (respostaBD.rowCount != 0) {
                console.log(`Curso cadastrado com sucesso! ID do curso: ${respostaBD.rows[0].id_curso}`);
                return true;
            }

            return false;
        } catch (error) {
            console.log('Erro ao cadastrar o Curso. Verifique os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }

    /**
     * Inativa um curso (e suas matrículas) no banco de dados com base no ID fornecido.
     * 
     * @param id_curso - ID do curso a ser inativado
     * @returns true se a operação foi bem-sucedida, false caso contrário
     */
    static async removerCurso(id_curso: number): Promise<Boolean> {
        let queryResult = false;

        try {
            // Inativa todas as matrículas associadas ao curso
            const queryDeleteMatriculaCurso = `UPDATE Matricula 
                                                SET status_matricula = FALSE
                                                WHERE id_curso=${id_curso};`;

            await database.query(queryDeleteMatriculaCurso);

            // Inativa o curso
            const queryDeleteCurso = `UPDATE Curso 
                                      SET status_curso = FALSE
                                      WHERE id_curso =${id_curso};`;

            await database.query(queryDeleteCurso)
                .then((result) => {
                    if (result.rowCount != 0) {
                        queryResult = true;
                    }
                });

            return queryResult;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }

    /**
     * Atualiza os dados de um curso já existente no banco de dados.
     * 
     * @param curso - Objeto Curso com os dados atualizados
     * @returns true se a atualização foi realizada com sucesso, false em caso de erro
     */
    static async atualizaCurso(curso: Curso): Promise<Boolean> {
        let queryResult = false;
        try {
            const queryAtualizarCurso = `UPDATE Curso
                                            SET nome = '${curso.getNome()}', 
                                                area = '${curso.getArea()}',
                                                carga_horaria = '${curso.getCargaHoraria()}'
                                            WHERE id_curso = ${curso.getIdCurso()};`;

            await database.query(queryAtualizarCurso)
                .then((result) => {
                    if (result.rowCount != 0) {
                        queryResult = true;
                    }
                });

            return queryResult;
        } catch (error) {
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }
}
