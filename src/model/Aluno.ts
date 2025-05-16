import { DataBaseModel } from "./DataBaseModel"; // Importa a classe de modelo de banco de dados

// Armazena o pool de conexões
const database = new DataBaseModel().pool;

/**
 * Classe que representa um cliente (neste contexto chamado de "Aluno").
 */
export class Aluno {

    /* Atributos */
    /* Identificador do cliente */
    private idAluno: number = 0;
    /* Nome completo do cliente */
    private nomeInteiro: string;
    /* CPF do cliente */
    private cpf: string;
    /* E-mail do cliente */
    private email: string;
    /* Número de celular do cliente */
    private celular: string;
    /* Controle de status do cliente  */
    private statusAluno: boolean = true;

    /**
     * Construtor da classe Cliente
     * @param nomeInteiro Nome completo do cliente
     * @param cpf CPF do cliente
     * @param email E-mail do cliente
     * @param celular Número de celular do cliente
     */
    constructor(
        nomeInteiro: string,
        cpf: string,
        email: string,
        celular: string
    ) {
        // Inicializa os atributos com os valores recebidos
        this.nomeInteiro = nomeInteiro;
        this.cpf = cpf;
        this.email = email;
        this.celular = celular;
    }

    /* Métodos get e set */

    // Recupera o ID do aluno
    public getIdAluno(): number {
        return this.idAluno;
    }

    // Define o ID do aluno
    public setIdAluno(idAluno: number): void {
        this.idAluno = idAluno;
    }

    // Recupera o nome completo do aluno
    public getNomeInteiro(): string {
        return this.nomeInteiro;
    }

    // Define o nome completo do aluno
    public setNomeInteiro(nomeInteiro: string): void {
        this.nomeInteiro = nomeInteiro;
    }

    // Recupera o CPF do aluno
    public getCpf(): string {
        return this.cpf;
    }

    // Define o CPF do aluno
    public setCpf(cpf: string): void {
        this.cpf = cpf;
    }

    // Recupera o e-mail do aluno
    public getEmail(): string {
        return this.email;
    }

    // Define o e-mail do aluno
    public setEmail(email: string): void {
        this.email = email;
    }

    // Recupera o número de celular do aluno
    public getCelular(): string {
        return this.celular;
    }

    // Define o número de celular do aluno
    public setCelular(celular: string): void {
        this.celular = celular;
    }

    // Recupera o status ativo/inativo do aluno
    public getStatusAluno(): boolean {
        return this.statusAluno;
    }

    // Define o status ativo/inativo do aluno
    public setStatusAluno(statusAluno: boolean): void {
        this.statusAluno = statusAluno;
    }

    /**
     * Lista todos os alunos ativos do banco de dados.
     * @returns Um array de objetos Aluno ou null em caso de erro.
     */
    static async listagemAlunos(): Promise<Array<Aluno> | null> {
        const listaDeAlunos: Array<Aluno> = [];
        try {
            // Query que busca apenas alunos ativos
            const querySelectAlunos = `SELECT * FROM Aluno WHERE status_aluno = true;`;
            const respostaBD = await database.query(querySelectAlunos);

            // Itera sobre os resultados e cria instâncias de Aluno
            respostaBD.rows.forEach((linha) => {
                const novoAluno = new Aluno(
                    linha.nome_inteiro,
                    linha.cpf,
                    linha.email,
                    linha.celular
                );
                novoAluno.setIdAluno(linha.id_aluno);
                novoAluno.setStatusAluno(linha.status_aluno);
                listaDeAlunos.push(novoAluno);
            });

            return listaDeAlunos;
        } catch (error) {
            console.log('Erro ao buscar lista de alunos');
            return null;
        }
    }

    /**
     * Cadastra um novo aluno no banco de dados.
     * @param aluno Objeto da classe Aluno com os dados a serem inseridos
     * @returns true em caso de sucesso, false em caso de erro
     */
    static async cadastroAluno(aluno: Aluno): Promise<boolean> {
        try {
            // Monta a query SQL para inserir o aluno
            const queryInsertAluno = `INSERT INTO Aluno (nome_inteiro, cpf, email, celular) VALUES
                                    ('${aluno.getNomeInteiro()}', 
                                    '${aluno.getCpf()}',
                                    '${aluno.getEmail()}',
                                    '${aluno.getCelular()}')
                                    RETURNING id_aluno;`;

            // Executa a query
            const respostaBD = await database.query(queryInsertAluno);

            // Verifica se houve retorno do ID (inserção bem-sucedida)
            if (respostaBD.rowCount != 0) {
                console.log(`Aluno cadastrado com sucesso! ID do aluno: ${respostaBD.rows[0].id_aluno}`);
                return true;
            }

            return false;
        } catch (error) {
            // Em caso de erro, registra e retorna falso
            console.log('Erro ao cadastrar o aluno. Verifique os logs para mais detalhes.');
            console.log(error);
            return false;
        }
    }

    /**
     * Remove (inativa) um aluno do banco de dados.
     * @param idAluno ID do aluno a ser removido
     * @returns true se a remoção for bem-sucedida, false caso contrário
     */
    static async removerAluno(id_aluno: number): Promise<Boolean> {
        let queryResult = false;

        try {
            // Inativa as matrículas do aluno
            const queryDeleteMatriculaAluno = `UPDATE Matricula 
                                                        SET status_matricula = FALSE
                                                        WHERE id_aluno=${id_aluno};`;
            await database.query(queryDeleteMatriculaAluno);

            // Inativa o próprio aluno
            const queryDeleteAluno = `UPDATE aluno 
                                            SET status_aluno = FALSE
                                            WHERE id_aluno =${id_aluno};`;

            await database.query(queryDeleteAluno)
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
     * Atualiza os dados de um aluno no banco de dados.
     * @param aluno Objeto da classe Aluno com os dados atualizados
     * @returns true em caso de sucesso, false em caso de erro
     */
    static async atualizarAluno(aluno: Aluno): Promise<Boolean> {
        let queryResult = false;
        try {
            // Query para atualizar os dados do aluno com base no ID
            const queryAtualizarAluno = `UPDATE aluno
                                            SET nome_inteiro ='${aluno.getNomeInteiro()}', 
                                            cpf = '${aluno.getCpf()}',
                                            email = '${aluno.getEmail()}', 
                                            celular = '${aluno.getCelular()}'
                                            WHERE id_aluno = ${aluno.getIdAluno()};`;

            await database.query(queryAtualizarAluno)
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
