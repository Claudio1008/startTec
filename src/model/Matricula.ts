import { DataBaseModel } from "./DataBaseModel";

// Criação da conexão com o banco de dados
const database = new DataBaseModel().pool;

/**
 * Classe que representa uma matrícula de um aluno em um curso.
 */
export class Matricula {

    /* Atributos privados da matrícula */

    private idMatricula: number = 0; // Identificador único da matrícula
    private idAluno: number;         // Identificador do aluno
    private idCurso: number;         // Identificador do curso
    private dataMatricula: Date;     // Data da matrícula
    private statusMatricula: string; // Status atual da matrícula (ativo, cancelado, etc.)

    /**
     * Construtor da classe Matricula.
     * @param idAluno - ID do aluno matriculado
     * @param idCurso - ID do curso da matrícula
     * @param dataMatricula - Data de realização da matrícula
     * @param statusMatricula - Status da matrícula (ex: "ativa", "cancelada")
     */
    constructor(
        idAluno: number,
        idCurso: number,
        dataMatricula: Date,
        statusMatricula: string,
    ) {
        this.idAluno = idAluno;
        this.idCurso = idCurso;
        this.dataMatricula = dataMatricula;
        this.statusMatricula = statusMatricula;
    }

    /* Getters e setters */

    public getIdMatricula(): number {
        return this.idMatricula;
    }

    public setIdMatricula(idMatricula: number): void {
        this.idMatricula = idMatricula;
    }

    public getidAluno(): number {
        return this.idAluno;
    }

    public setidAluno(idAluno: number): void {
        this.idAluno = idAluno;
    }

    public getidCurso(): number {
        return this.idCurso;
    }

    public setidCurso(idCurso: number): void {
        this.idCurso = idCurso;
    }

    public getdataMatricula(): Date {
        return this.dataMatricula;
    }

    public setdataMatricula(dataMatricula: Date): void {
        this.dataMatricula = dataMatricula;
    }

    public getStatusMatricula(): string {
        return this.statusMatricula;
    }

    public setStatusMatricula(statusMatricula: string): void {
        this.statusMatricula = statusMatricula;
    }

    /**
     * Retorna todas as matrículas do banco de dados.
     * @returns Lista de objetos `Matricula` ou `null` em caso de erro.
     */
    static async listarMatricula(): Promise<Array<Matricula> | null> {
        const listaDeMatricula: Array<Matricula> = [];

        try {
            const querySelectMatricula = `SELECT * FROM Emprestimo;`;

            const respostaBD = await database.query(querySelectMatricula);

            respostaBD.rows.forEach((linha) => {
                const novoMatricula = new Matricula(
                    linha.id_aluno,
                    linha.id_curso,
                    linha.data_matricula,
                    linha.status_matricula
                );

                novoMatricula.setIdMatricula(linha.id_matricula);
                listaDeMatricula.push(novoMatricula);
            });

            return listaDeMatricula;
        } catch (error) {
            console.log('Erro ao buscar lista de Matricula');
            return null;
        }
    }

    /**
     * Cadastra uma nova matrícula no banco de dados.
     * @param Matricula - Objeto de matrícula a ser inserido.
     * @returns `true` se cadastrada com sucesso, `false` caso contrário.
     */
    static async cadastroMatricula(Matricula: Matricula): Promise<boolean> {
        try {
            const querySelectMatricula = `INSERT INTO Matricula (idMatricula, idAluno, idCurso ,dataMatricula, statusMatricula)
                                        VALUES
                                        (
                                        '${Matricula.getIdMatricula()}', 
                                        '${Matricula.getidAluno()}',
                                        '${Matricula.getidCurso()}', 
                                        '${Matricula.getdataMatricula()}, 
                                        '${Matricula.getStatusMatricula}',
                                        RETURNING id_matricula`;

            const respostaBD = await database.query(querySelectMatricula);

            if (respostaBD.rowCount != 0) {
                console.log(`Matricula cadastrada com sucesso! ID: ${respostaBD.rows[0].id_matricula}`);
                return true;
            }

            return false;

        } catch (error) {
            console.log('Erro ao cadastrar a matricula. Verifique os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }

    /**
     * Remove uma matrícula do banco de dados.
     * @param idMatricula - ID da matrícula a ser removida.
     * @returns `true` se removida com sucesso, `false` caso contrário.
     */
    static async removerMatricula(idMatricula: number): Promise<boolean> {
        try {
            const queryDeleteMatricula = `DELETE FROM Matricula WHERE id_matricula = ${idMatricula}`;

            const respostaBD = await database.query(queryDeleteMatricula);

            if (respostaBD.rowCount != 0) {
                console.log(`Matricula removida com sucesso! ID: ${idMatricula}`);
                return true;
            }

            return false;

        } catch (error) {
            console.log(`Erro ao remover Matricula. Verifique os logs para mais detalhes.`);
            console.log(error);
            return false;
        }
    }

    /**
     * Atualiza os dados de uma matrícula existente.
     * @param matricula - Objeto com os novos dados.
     * @returns `true` se atualizada com sucesso, `false` caso contrário.
     */
    static async atualizarMatricula(matricula: Matricula): Promise<boolean> {
        try {
            const queryUpdateMatricula = `UPDATE Matricula
                                        SET 
                                        id_aluno = '${matricula.getidAluno()}',
                                        id_curso = '${matricula.getidCurso()}', 
                                        data_matricula = '${matricula.getdataMatricula()}', 
                                        status_matricula = '${matricula.getStatusMatricula()}'
                                        WHERE id_matricula = ${matricula.getIdMatricula()};`;

            const respostaBD = await database.query(queryUpdateMatricula);

            if (respostaBD.rowCount != 0) {
                console.log(`Matricula atualizada com sucesso! ID: ${matricula.getIdMatricula()}`);
                return true;
            }

            return false;

        } catch (error) {
            console.log('Erro ao atualizar a Matricula. Verifique os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }
}
