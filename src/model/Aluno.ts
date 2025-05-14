import { DataBaseModel } from "./DataBaseModel";

// Recupera conexão com o banco de dados
const database = new DataBaseModel().pool;

/**
 * Classe que representa um aluno no sistema
 */
export class Aluno {
    private idAluno: number = 0; // Identificador único do aluno
    private nomeInteiro: string; // Nome do aluno
    private cpf: string;
    private email: string; //E-mail do aluno
    private celular: string; // Celular do aluno
    private statusAluno: boolean = true; // Controla o status do aluno no sistema

    /**
     * Construtor da classe Aluno
     * 
     * @param nomeInteiro Nome do Aluno
     * @param cpf cpf do aluno
     * @param email Email do Aluno
     * @param celular Celular do Aluno
     */
    public constructor (_nomeInteiro:string, _cpf:string, _email:string, _celular:string){
        this.nomeInteiro    = _nomeInteiro;
        this.cpf            = _cpf
        this.email          = _email;
        this.celular        = _celular;
    }

    //métodos GETTERS and SETTERS
    /**
     * Retorna o id do aluno
     * @returns id: id aluno
     */
    public getIdAluno(): number{
        return this.idAluno;
    }

    /**
     * Atribui o parâmetro ao atributo idAluno
     * 
     * @param _idAluno : idAluno
     */
    public setIdAluno(_idAluno: number): void{
        this.idAluno = _idAluno;
    }
    

    /**
     * Retorna o nome do aluno
     * @returns nome: nome aluno
     */
    public getNomeInteiro() {  
        return this.nomeInteiro;
    }

    /**
     * Atribui o parâmetro ao atributo nome
     * 
     * @param _nome : nome do aluno
     */
    public setNomeInteiro(_nomeInteiro: string){  
        this.nomeInteiro = _nomeInteiro;
    }

    /**
     * Retorna o sobrenome do aluno
     * @returns sobrenome: sobrenome aluno
     */
    public getCpf() {  
        return this.cpf;
    }

    /**
     * Atribui o parâmetro ao atributo sobrenome
     * 
     * @param _sobrenome : sobrenome do aluno
     */
    public setCpf(_cpf: string){  
        this.cpf = _cpf;
    }


    /**
     * Retorna o email do aluno
     * @returns email: email aluno
     */
    public getEmail() {
        return this.email;
    }

    /**
     * Retorna o celular do aluno
     * @returns celular: celular aluno
     */
    public getCelular() {
        return this.celular;
    }

    /**
     * Atribui o parâmetro ao atributo celular
     * 
     * @param _celular : celular do aluno
     */
    public setCelular(_celular: string) {
        this.celular = _celular;
    }

    /**
     * Retorna o status do aluno no sistema
     * 
     * @return Status do aluno no sistema
     */
    public getStatusAluno(): boolean {
        return this.statusAluno;
    }

    /**
     * Atribui um valor ao status do aluno
     * 
     * @param _statusAluno : Valor a ser atribuido ao status do aluno
     */
    public setStatusAluno(_statusAluno: boolean): void {
        this.statusAluno = _statusAluno;
    }

    // MÉTODO PARA ACESSAR O BANCO DE DADOS
    // CRUD Create - READ - Update - Delete

    /**
     * Retorna uma lista com todos os alunos cadastrados no banco de dados
     * 
     * @returns Lista com todos os alunos cadastrados no banco de dados
     */
    static async listagemAlunos(): Promise<Array<Aluno> | null> {
        // Criando lista vazia para armazenar os alunos
        let listaDeAlunos: Array<Aluno> = [];

        try {
            // Query para consulta no banco de dados
            const querySelectAluno = `SELECT * FROM Aluno WHERE status_aluno = true;`;

            // executa a query no banco de dados
            const respostaBD = await database.query(querySelectAluno);    

            // percorre cada resultado retornado pelo banco de dados
            // aluno é o apelido que demos para cada linha retornada do banco de dados
            respostaBD.rows.forEach((aluno) => {
                
                // criando objeto aluno
                const novoAluno = new Aluno(
                    aluno.nomeInteiro,
                    aluno.cpf,
                    aluno.email,
                    aluno.celular
                );
                // adicionando o ID ao objeto
                novoAluno.setIdAluno(aluno.id_aluno);
                novoAluno.setStatusAluno(aluno.status_aluno);

                // adicionando a pessoa na lista
                listaDeAlunos.push(novoAluno);
            });

            // retornado a lista de pessoas para quem chamou a função
            return listaDeAlunos;
        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Cadastra um novo aluno no banco de dados
     * @param aluno Objeto Aluno contendo as informações a serem cadastradas
     * @returns Boolean indicando se o cadastro foi bem-sucedido
     */
    static async cadastrarAluno(aluno: Aluno): Promise<Boolean> {      
        try {
            // Cria a consulta (query) para inserir o registro de um aluno no banco de dados, retorna o ID do aluno que foi criado no final
            const queryInsertAluno = `
                INSERT INTO Aluno (nome_inteiro, cpf, email, celular)
                VALUES (
                    '${aluno.getNomeInteiro()}',
                    '${aluno.getCpf()}',
                    '${aluno.getEmail()}',
                    '${aluno.getCelular()}'
                )
                RETURNING id_aluno;`;

            // Executa a query no banco de dados e armazena o resultado
            const result = await database.query(queryInsertAluno);

            // verifica se a quantidade de linhas que foram alteradas é maior que 0
            if (result.rows.length > 0) {
                // Exibe a mensagem de sucesso
                console.log(`Aluno cadastrado com sucesso. ID: ${result.rows[0].id_aluno}`);
                // retorna verdadeiro
                return true;
            }

            // caso a consulta não tenha tido sucesso, retorna falso
            return false;
        // captura erro
        } catch (error) {
            // Exibe mensagem com detalhes do erro no console
            console.error(`Erro ao cadastrar aluno: ${error}`);
            // retorna falso
            return false;
        }
    }

    /**
     * Remove um aluno do banco de dados
     * @param idAluno ID do aluno a ser removido
     * @returns Boolean indicando se a remoção foi bem-sucedida
    */
    static async removerAluno(id_aluno: number): Promise<Boolean> {
        // variável para controle de resultado da consulta (query)
        let queryResult = false;
    
        try {
            // Cria a consulta (query) para remover o aluno
            const queryDeleteMatriculaAluno = `UPDATE matricula 
                                                    SET status_matricula = FALSE
                                                    WHERE id_aluno=${id_aluno};`;

            // remove os emprestimos associado ao aluno
            await database.query(queryDeleteMatriculaAluno);

            // Construção da query SQL para deletar o Aluno.
            const queryDeleteAluno = `UPDATE aluno 
                                        SET status_aluno = FALSE
                                        WHERE id_aluno=${id_aluno};`;
    
            // Executa a query de exclusão e verifica se a operação foi bem-sucedida.
            await database.query(queryDeleteAluno)
            .then((result) => {
                if (result.rowCount != 0) {
                    queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
                }
            });
    
            // retorna o resultado da query
            return queryResult;

        // captura qualquer erro que aconteça
        } catch (error) {
            // Em caso de erro na consulta, exibe o erro no console e retorna false.
            console.log(`Erro na consulta: ${error}`);
            // retorna false
            return queryResult;
        }
    }

    static async atualizarAluno(aluno: Aluno): Promise<Boolean> {
        let queryResult = false; // Variável para armazenar o resultado da operação.
        
        try {
            // Verifique se os dados são válidos antes de executar a query
            if (isNaN(aluno.getIdAluno())) {
                console.error("ID do aluno inválido.");
                return queryResult;
            }
            
            if (!aluno.getNomeInteiro() || !aluno.getCpf() || !aluno.getEmail() || !aluno.getCelular()) {
                console.error("Faltam dados necessários para o aluno.");
                return queryResult;
            }
            
            // Construção da query SQL para atualizar os dados do aluno no banco de dados.
            const queryAtualizarAluno = `UPDATE Aluno 
                                            SET nome_inteiro ='${aluno.getNomeInteiro()}', 
                                            cpf = '${aluno.getCpf()}',
                                            email = '${aluno.getEmail()}', 
                                            celular = '${aluno.getCelular()}'
                                            WHERE id_aluno = ${aluno.getIdAluno()};`;
    
            // Executa a query de atualização e verifica se a operação foi bem-sucedida.
            const result = await database.query(queryAtualizarAluno);
    
            if (result.rowCount !== 0) {
                queryResult = true; // Se a operação foi bem-sucedida, define queryResult como true.
            }
    
            // Retorna o resultado da operação
            return queryResult;
        } catch (error) {
            // Em caso de erro na consulta, exibe o erro no console e retorna false.
            console.log(`Erro na consulta: ${error}`);
            return queryResult;
        }
    }
    
}