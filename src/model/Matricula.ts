import { DataBaseModel } from "./DataBaseModel";

const database = new DataBaseModel().pool;
/**
 * classe que representa o Emprestimo
 */
export class Matricula {

    /* Atributos */
    /* Identificador do Emprestimo */
    private idMatricula: number = 0;
    /* identificador do Aluno */
    private idAluno: number;
    /* identificador do Emprestimo */
    private idCurso: number;
    /* data do Emprestimo */
    private dataMatricula: Date;
    /* Status do Emprestimo */
    private statusMatricula: string;
    

     /**
     * Construtor da classe Emprestimo
     * @param idAluno id do Aluno
     * @param idMatricula id do Emprestimo
     * @param dataMatricula data do Emprestimo
     * @param StatusMatricula Status do Emprestimo
     */
    
    
    constructor(
        idAluno: number,
        idCurso: number,
        dataMatricula: Date,
        statusMatricula:string,
    ) {
        this.idAluno = idAluno;
        this.idCurso = idCurso;
        this.dataMatricula = dataMatricula;
        this.statusMatricula = statusMatricula;
    }
    
        /* Métodos get e set */
    /**
     * Recupera o identificador do Emprestimo
     * @returns o identificador do Emprestimo
     */
    public getIdMatricula(): number {
        return this.idMatricula;
    }

    /**
     * Atribui um Status ao identificador do Emprestimo
     * @param idMatricula novo identificado do Emprestimo
     */
    public setIdMatricula(idMatricula: number): void {
        this.idMatricula = idMatricula;
    }

    /**
     * Retorna o idAluno do Emprestimo.
     *
     * @returns {number} o idAluno do Emprestimo.
     */
    public getidAluno(): number {
        return this.idAluno;
    }
    
    /**
     * Define O idAluno do Emprestimo.
     * 
     * @param idAluno - o idAluno do Emprestimo a ser definido.
     */
    public setidAluno(idAluno: number): void {
        this.idAluno = idAluno;
    }

        /**
     * Retorna o idEmprestimo do Emprestimo.
     *
     * @returns {number} o idEmprestimo do Emprestimo.
     */
    public getidCurso(): number {
        return this.idCurso;
    }
    
    /**
     * Define o idEmprestimo do Emprestimo.
     * 
     * @param idMatricula - o idEmprestimo do Emprestimo a ser definido.
     */
    public setidCurso(idCurso: number): void {
        this.idCurso = idCurso;
    }

    /**
     * Retorna o data do Emprestimo.
     *
     * @returns {Date} o data do Emprestimo.
     */
    public getdataMatricula(): Date {
        return this.dataMatricula;
    }
    
    /**
     * Define o data do Emprestimo.
     * 
     * @param dataMatricula - o data do Emprestimo a ser definido.
     */
    public setdataMatricula(dataMatricula: Date): void {
        this.dataMatricula = dataMatricula;
    }

    /**
     * Retorna o Status do Emprestimo.
     *
     * @returns {string} o Status do Emprestimo 
     */
    public getStatusMatricula(): string {
        return this.statusMatricula;
    }
    
    /**
     * Define o Status do Emprestimo.
     * 
     * @param StatusMatricula - o Status do Emprestimo a ser definido.
     */
    public setStatusMatricula(statusMatricula: string): void {
        this.statusMatricula = statusMatricula;
    }



    /**
     * Busca e retorna uma lista de Emprestimo do banco de dados.
     * @returns Um array de objetos do tipo `Emprestimo` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
     * 
     * - A função realiza uma consulta SQL para obter todas as informações da tabela "Emprestimo".
     * - Os dados retornados do banco de dados são usados para instanciar objetos da classe `Emprestimo`.
     * - Cada Emprestimo é adicionado a uma lista que será retornada ao final da execução.
     * - Se houver falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
     */
    static async listarMatricula(): Promise<Array<Matricula> | null> {
        // objeto para armazenar a lista de Emprestimo
        const listaDeMatricula: Array<Matricula> = [];

        try {
            // query de consulta ao banco de dados
            const querySelectMatricula = `SELECT * FROM Emprestimo;`;

            // fazendo a consulta e guardando a resposta
            const respostaBD = await database.query(querySelectMatricula);

            // usando a resposta para instanciar um objeto do tipo Emprestimo
            respostaBD.rows.forEach((linha) => {
                // instancia (cria) objeto Emprestimo
                const novoMatricula = new Matricula(
                    linha.id_aluno,
                    linha.id_curso,
                    linha.data_matricula,
                    linha.status_matricula
                );

                // atribui o ID objeto
                novoMatricula.setIdMatricula(linha.id_matricula);

                // adiciona o objeto na lista
                listaDeMatricula.push(novoMatricula);
            });

            // retorna a lista de Emprestimo
            return listaDeMatricula;
        } catch (error) {
            console.log('Erro ao buscar lista de Matricula');
            return null;
        }
    }

    /**
     * Realiza o cadastro de um Emprestimo no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Emprestimo` e insere seus dados (isbn, modelo, ano e cor)
     * na tabela `Emprestimo` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Matricula} Matricula - Objeto contendo os dados do Emprestimo que será cadastrado. O objeto `Emprestimo`
     *                        deve conter os métodos `getTitulo()`, `getAutor()`, `getAnoPublicacao()` e `getIsbn()`
     *                        que retornam os respectivos valores do Emprestimo.
     * @returns {Promise<boolean>} - Retorna `true` se o Emprestimo foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroMatricula(Matricula: Matricula): Promise<boolean> {
        try {
            // query para fazer insert de um Emprestimo no banco de dados
            const querySelectMatricula = `INSERT INTO Matricula (idMatricula, idAluno, idCurso ,dataMatricula, statusMatricula)
                                        VALUES
                                        (
                                        '${Matricula.getIdMatricula()}', 
                                        '${Matricula.getidAluno()}',
                                        '${Matricula.getidCurso()}', 
                                        '${Matricula.getdataMatricula()}, 
                                        '${Matricula.getStatusMatricula}',
                                        RETURNING id_matricula`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(querySelectMatricula);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Emprestimo cadastrado com sucesso! ID do matricula: ${respostaBD.rows[0].id_matricula}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar a matricula. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }

    static async removerMatricula(idMatricula: number): Promise<boolean> {
        try {
            const queryDeleteMatricula = `DELETE FROM Matricula WHERE id_matricula = ${idMatricula}`;

            const respostaBD = await database.query(queryDeleteMatricula);

            if(respostaBD.rowCount != 0) {
                console.log(`Matricula removido com sucesso!. ID removido: ${idMatricula}`);

                return true;
            }

            return false;

        } catch (error) {

            console.log(`erro ao remover Matricula registrada . verifique os logs para mais detalhes,`);

            console.log(error);

            return false;
        }
    }

    static async atualizarMatricula(matricula: Matricula): Promise<boolean> {
        try {
            // query para fazer update de um Emprestimo no banco de dados
            const queryUpdateMatricula = `UPDATE Matricula
                                        SET 
                                        id_aluno = '${matricula.getidAluno()}',
                                        id_curso = '${matricula.getidCurso()}', 
                                        data_matricula = '${matricula.getdataMatricula()}', 
                                        status_matricula = '${matricula.getStatusMatricula()}'
                                        WHERE id_matricula = ${matricula.getIdMatricula()};`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryUpdateMatricula);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Matricula atualizado com sucesso! ID da Matricula: ${matricula.getIdMatricula()}`);
                // true significa que a atualização foi bem sucedida
                return true;
            }
            // false significa que a atualização NÃO foi bem sucedida.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao atualizar a Matricula. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }
}