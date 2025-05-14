import { DataBaseModel } from "./DataBaseModel";

// Recupera a conexão com o banco de dados
const database = new DataBaseModel().pool;

/**
 * Classe que representa um Curso no sistema
 */
export class Curso {
    static setIdCurso(arg0: number) {
        throw new Error("Method not implemented.");
    }
    static atualizarCurso(CursoAtualizado: any) {
        throw new Error("Method not implemented.");
    }
    private idCurso: number = 0; // Identificador único do curso
    private nome: string; // Nome do curso
    private area: string; // Área de conhecimento do curso
    private cargaHoraria: string; // Carga horária do curso
    private statusCurso: boolean = true; // Status do curso (ativo ou inativo)

    /**
    * Construtor da classe Curso
    * 
    * @param nome Nome do Curso
    * @param area Área do Curso
    * @param cargaHoraria Carga horária do Curso
    */
    public constructor(_nome: string, _area: string, _cargaHoraria: string) {
        this.nome = _nome;
        this.area = _area;
        this.cargaHoraria = _cargaHoraria;
    }

    // Métodos GETTERS e SETTERS

    /**
     * Retorna o id do curso
     */
    public getIdCurso(): number {
        return this.idCurso;
    }

    /**
     * Define o ID do curso
     */
    public setIdCurso(_idCurso: number): void {
        this.idCurso = _idCurso;
    }

    /**
     * Retorna o nome do curso
     */
    public getNome(): string {
        return this.nome;
    }

    /**
     * Define o nome do curso
     */
    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    /**
     * Retorna a área do curso
     */
    public getArea(): string {
        return this.area;
    }

    /**
     * Define a área do curso
     */
    public setArea(_area: string): void {
        this.area = _area;
    }

    /**
     * Retorna a carga horária do curso
     */
    public getCargaHorario(): string {
        return this.cargaHoraria;
    }

    /**
     * Define a carga horária do curso
     */
    public setCargaHoraria(_cargaHoraria: string): void {
        this.cargaHoraria = _cargaHoraria;
    }

    /**
     * Retorna o status do curso
     */
    public getStatusCurso(): boolean {
        return this.statusCurso;
    }

    /**
     * Define o status do curso
     */
    public setStatusCurso(_statusCurso: boolean) {
        this.statusCurso = _statusCurso;
    }

    // Métodos de acesso ao banco de dados - CRUD (Create, Read, Update, Delete)

    /**
     * Retorna uma lista com todos os cursos ativos cadastrados no banco de dados
     */
    static async listarCursos(): Promise<Array<Curso> | null> {
        let listaDeCurso: Array<Curso> = [];

        try {
            const querySelectCurso = `SELECT * FROM Curso WHERE status_curso = true;`;

            const respostaBD = await database.query(querySelectCurso);

            respostaBD.rows.forEach((curso) => {
                let novoCurso = new Curso(
                    curso.nome,
                    curso.area,
                    curso.cargaHoraria
                );
                novoCurso.setIdCurso(curso.id_curso);
                novoCurso.setStatusCurso(curso.status_curso);
                listaDeCurso.push(novoCurso);
            });

            return listaDeCurso;

        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo curso no banco de dados
     */
    static async cadastrarCurso(curso: Curso): Promise<Boolean> {
        let insertResult = false;

        try {
            const queryInsertCurso = `
                INSERT INTO Curso (nome, area, carga_horaria, status_curso)
                VALUES (
                    '${curso.getNome()}',
                    '${curso.getArea()}',
                    '${curso.getCargaHorario()}',
                    '${curso.getStatusCurso()}'
                )
                RETURNING id_curso;`;

            const result = await database.query(queryInsertCurso);

            if (result.rows.length > 0) {
                console.log(`Curso cadastrado com sucesso. ID: ${result.rows[0].id_curso}`);
                insertResult = true;
            }

            return insertResult;

        } catch (error) {
            console.error(`Erro ao cadastrar Curso: ${error}`);
            return insertResult;
        }
    }

    /**
     * Remove (inativa) um curso do banco de dados
     */
    static async removerCurso(id_curso: number): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryDeleteMatriculaCurso = `UPDATE matricula
                                                    SET status_matricula = FALSE 
                                                    WHERE id_curso=${id_curso}`;

            await database.query(queryDeleteMatriculaCurso);

            const queryDeleteCurso = `UPDATE Curso
                                        SET status_curso = FALSE 
                                        WHERE id_curso=${id_curso};`;

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
     * Atualiza os dados de um curso no banco de dados
     */
    static async atualizarCadastroCurso(curso: Curso): Promise<Boolean> {
        let queryResult = false;

        try {
            const queryAtualizarCurso = `UPDATE Curso SET 
                                            nome = '${curso.getNome()}', 
                                            area = '${curso.getArea()}',
                                            carga_horaria = '${curso.getCargaHorario()}', 
                                            status_curso = '${curso.getStatusCurso()}'                                           
                                        WHERE id_curso = ${curso.idCurso}`;

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
