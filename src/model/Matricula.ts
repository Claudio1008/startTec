// Importa a classe DatabaseModel do arquivo DataBaseModel
import { DataBaseModel } from "./DataBaseModel";
import { CursoController } from "../controller/CursoController";

// Armazena o pool de conexões com o banco de dados
const database = new DataBaseModel().pool;

/** 
 * Classe que representa uma Venda.
 * 
 * A classe contém atributos e métodos para manipular informações sobre vendas, como o id da venda, cliente, vestuário,
 * data e status da venda.
 */
export class Matricula {
    /* Atributos */
    /* Identificador único da venda */
    private idMatricula: number = 0;
    /* Identificador do cliente associado à venda */
    private idAluno: number = 0;
    /* Identificador do vestuário associado à venda */
    private idCurso: number = 0;
    /* Data em que a venda foi realizada */
    private dataMatricula: Date;
    /* Status da venda, que pode ser 'concluída', 'pendente', etc. */
    private statusMatricula: string;

    /**
     * Construtor da classe Venda
     * 
     * O construtor recebe os parâmetros necessários para inicializar uma venda, como o id da venda, id do cliente,
     * id do vestuário, data da venda e o status da venda.
     * 
     * @param idMatricula Identificador da venda
     * @param idAluno Identificador do cliente associado à venda
     * @param idCurso Identificador do vestuário vendido
     * @param dataMatricula Data em que a venda ocorreu
     * @param statusMatricula Status atual da venda
     */
    constructor(
        idAluno: number,
        idCurso: number,
        dataMatricula: Date,
        statusMatricula: string
    ) {
        this.idAluno = idAluno;
        this.idCurso = idCurso;
        this.dataMatricula = dataMatricula;
        this.statusMatricula = statusMatricula;
    }

    /* Métodos get e set */

    /**
     * Recupera o id da venda.
     * @returns O id da venda.
     */
    public getIdMatricula(): number {
        return this.idMatricula;
    }

    /**
     * Define o id da venda.
     * @param idVenda O novo id da venda.
     */
    public setIdMatricula(idMatricula: number): void {
        this.idMatricula = idMatricula;
    }

    /**
     * Recupera o id do cliente associado à venda.
     * @returns O id do cliente.
     */
    public getIdAluno(): number {
        return this.idAluno;
    }

    /**
     * Define o id do cliente associado à venda.
     * @param idAluno O novo id do cliente.
     */
    public setIdAluno(idAluno: number): void {
        this.idAluno = idAluno;
    }

    /**
     * Recupera o id do vestuário associado à venda.
     * @returns O id do vestuário.
     */
    public getIdCurso(): number {
        return this.idCurso;
    }

    /**
     * Define o id do vestuário associado à venda.
     * @param idCurso O novo id do vestuário.
     */
    public setIdCurso(idCurso: number): void {
        this.idCurso = idCurso;
    }

    /**
     * Recupera a data da venda.
     * @returns A data em que a venda ocorreu.
     */
    public getDataMatricula(): Date {
        return this.dataMatricula;
    }

    /**
     * Define a data da venda.
     * @param dataVenda A nova data da venda.
     */
    public setDataMatricula(dataMatricula: Date): void {
        this.dataMatricula = dataMatricula;
    }

    /**
     * Recupera o status da venda.
     * @returns O status atual da venda.
     */
    public getStatusMatricula(): string {
        return this.statusMatricula;
    }

    /**
     * Define o status da venda.
     * @param statusMatricula O novo status da venda.
     */
    public setStatusMatricula(statusMatricula: string): void {
        this.statusMatricula = statusMatricula;
    }

    /**
     * Realiza a listagem de vendas no banco de dados.
     * 
     * Esta função consulta a tabela `venda` com seus respectivos vestuários
     * e retorna uma lista de objetos do tipo `Venda`, agrupando os vestuários
     * de cada venda dentro de um array.
     * 
     * @returns {Promise<Array<Matricula> | null>} - Um array de objetos do tipo `Venda` em caso de sucesso ou `null` se ocorrer um erro.
     */
    static async listarMatriculas(): Promise<Array<Matricula> | null> {
        // Lista final que será retornada
        const listaDeMatriculas: Array<any> = [];

        try {
            // Consulta SQL para buscar vendas e seus vestuários
            const querySelectMatricula = `SELECT 
            m.id_matricula,
            m.id_aluno,
            m.data_matricula,
            m.status_matricula,
            a.nome_inteiro,
            a.cpf,
            a.email,
            a.celular,
            c.id_curso,
            c.nome AS nome_curso,
            c.area,
            c.carga_horaria,
            c.status_curso
        FROM Matricula m
        JOIN Aluno a ON m.id_aluno = a.id_aluno
        JOIN Curso c ON m.id_curso = c.id_curso
        WHERE m.status_matricula = TRUE;`;
        

            // Executa a consulta
            const respostaBD = await database.query(querySelectMatricula);

            // Se não houver vendas, retorna null
            if (respostaBD.rows.length === 0) {
                return null;
            }

            // Percorre os resultados da consulta
            respostaBD.rows.forEach((linha: any) => {
                // Verifica se a venda já está na lista
                let matriculaExistente = listaDeMatriculas.find(v => v.idMatricula === linha.id_matricula);

                // Se não existe, cria um novo objeto de venda
                if (!matriculaExistente) {
                    matriculaExistente = {
                        idMatricula: linha.id_matricula,
                        idAluno: linha.id_aluno,
                        dataMatricula: linha.data_matricula,
                        statusMatricula: linha.status_matricula,
                        curso: []
                    };
                    listaDeMatriculas.push(matriculaExistente);
                }

                // Adiciona o vestuário atual à lista da venda existente
                matriculaExistente.curso.push({
                    idCurso: linha.id_curso,
                    nome: linha.nome,
                    area: linha.area
                });
            });

            // Retorna a lista agrupada
            return listaDeMatriculas;
        } catch (error) {
            console.log('Erro ao buscar lista de matriculas. Consulte os logs para mais detalhes.');
            console.log(error);
            return null;
        }
    }


    /**
     * Realiza o cadastro de uma venda no banco de dados.
     * 
     * @param venda Objeto do tipo Venda contendo as informações a serem cadastradas.
     * @returns {Promise<boolean>} Retorna `true` se o cadastro for bem-sucedido, caso contrário retorna `false`.
     */
    static async cadastroMatricula(matricula: Matricula): Promise<boolean> {
        try {
            // Monta a query SQL para inserir os dados da venda na tabela "vendas"
            const queryInsertMatricula = `INSERT INTO Matricula (id_aluno, id_curso, data_matricula, status_matricula) VALUES
                                        (${matricula.getIdAluno()}, 
                                        ${matricula.getIdCurso()},
                                        '${matricula.getDataMatricula()}',
                                        '${matricula.getStatusMatricula()}')
                                        RETURNING id_matricula;`;

            // Executa a query no banco de dados
            const respostaBD = await database.query(queryInsertMatricula);

            // Verifica se houve retorno de um ID da venda cadastrada
            if (respostaBD.rowCount != 0) {
                console.log(`Matricula cadastrada com sucesso! ID da venda: ${respostaBD.rows[0].id_matricula}`);
                return true;
            }

            // Se não houver ID retornado, considera que o cadastro falhou
            return false;
        } catch (error) {
            // Exibe mensagens de erro no console
            console.log('Erro ao cadastrar a matricula. Verifique os logs para mais detalhes.');
            console.log(error);

            // Retorna `false` indicando falha no cadastro
            return false;
        }
    }
    /**
     * Atualiza os dados de uma venda no banco de dados com base no ID fornecido.
     * 
     * @param venda Objeto do tipo Venda contendo as novas informações da venda.
     * @returns {Promise<boolean>} Retorna `true` se a atualização for bem-sucedida, caso contrário retorna `false`.
     */
    static async atualizarMatricula(matricula: Matricula): Promise<boolean> {
        try {
            // Monta a query SQL para atualizar os dados da venda no banco de dados
            const queryUpdateMatricula = `
                UPDATE Matricula SET
                id_aluno = ${matricula.getIdAluno()},
                data_matricula = '${matricula.getDataMatricula()}',
                status_matricula = '${matricula.getStatusMatricula()}',
                id_curso = ${matricula.getIdCurso()}
                WHERE id_matricula = ${matricula.getIdMatricula()};
            `;


            // Executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryUpdateMatricula);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Matricula atualizado com sucesso! ID do Pedido: ${matricula.getIdMatricula()}`);
                // true significa que a atualização foi bem sucedida
                return true;
            }
            // false significa que a atualização NÃO foi bem sucedida.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao atualizar matricula. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }
    /**
     * Remove uma venda do banco de dados
     * @param idVenda ID da venda a ser removida
     * @returns Boolean indicando se a remoção foi bem-sucedida
     */
    static async removerMatricula(id_matricula: number): Promise<Boolean> {
        // Variável para armazenar o resultado da operação  
        let queryResult = false;

        try {
            // Cria a consulta (query) para remover a  venda
            const queryDeleteMatricula = `UPDATE Matricula
                                        SET status_matricula = FALSE
                                        WHERE id_curso = ${id_matricula};`;


            await database.query(queryDeleteMatricula)
                .then((result) => {
                    // Se a consulta afetou alguma linha, considera como sucesso
                    if (result.rowCount != 0) {
                        queryResult = true;
                    }
                });

            // Retorna o resultado da operação
            return queryResult;

        } catch (error) {
            // Captura qualquer erro e exibe no console
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }
}
