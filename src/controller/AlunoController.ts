// Importa as definições de Request e Response do Express
import { Request, Response } from "express";

// Importa a classe Aluno do modelo correspondente
import { Aluno } from "../model/Aluno";

// Define a interface para representar os dados de um aluno
interface AlunoDTO {
    nomeInteiro: string; // Nome completo do aluno
    cpf: string;         // CPF do aluno
    email: string;       // E-mail do aluno
    celular: string;     // Número de celular do aluno
}

/**
 * Controlador para gerenciar as operações de Aluno na API.
 * Esta classe herda de `Aluno` e implementa métodos para listar, cadastrar, remover e atualizar alunos.
 */
export class AlunoController extends Aluno {

    /**
     * Lista todos os alunos cadastrados.
     * @param req - Objeto de requisição HTTP.
     * @param res - Objeto de resposta HTTP.
     * @returns - Retorna a lista de alunos em formato JSON com status 200 ou uma mensagem de erro com status 400.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Acessa a função para listar alunos e armazena o resultado
            const listaDeAlunos = await Aluno.listagemAlunos();

            // Retorna a lista de alunos como resposta em formato JSON
            return res.status(200).json(listaDeAlunos);
        } catch (error) {
            // Lança uma mensagem de erro no console
            console.log('Erro ao acessar listagem de alunos:', error);

            // Retorna uma mensagem de erro ao cliente
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de alunos" });
        }
    }

    /**
     * Cadastra um novo aluno no sistema.
     * @param req - Objeto de requisição HTTP contendo os dados do aluno no corpo da requisição.
     * @param res - Objeto de resposta HTTP.
     * @returns - Retorna uma mensagem de sucesso com status 200 ou uma mensagem de erro com status 400.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Recupera os dados do aluno enviados no corpo da requisição
            const alunoRecebido: AlunoDTO = req.body;

            // Cria uma nova instância de Aluno com os dados fornecidos
            const novoAluno = new Aluno(
                alunoRecebido.nomeInteiro,
                alunoRecebido.cpf,
                alunoRecebido.email,
                alunoRecebido.celular
            );

            // Chama a função responsável pelo cadastro do aluno no banco de dados
            const respostaClasse = await Aluno.cadastroAluno(novoAluno);

            // Verifica se o cadastro foi realizado com sucesso
            if (respostaClasse) {
                return res.status(200).json({ mensagem: "Aluno cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar o aluno. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log('Erro ao cadastrar aluno:', error);
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o aluno. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Remove (inativa) um aluno do sistema.
     * @param req - Objeto da requisição contendo o ID do aluno a ser removido.
     * @param res - Objeto da resposta HTTP que retorna o status da remoção.
     * @returns - Retorna uma resposta JSON indicando sucesso ou falha na operação.
     * @throws - Retorna um erro 400 caso ocorra falha na remoção do aluno.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            // Recupera o ID do aluno a ser removido a partir dos parâmetros da requisição
            const idAluno = parseInt(req.params.idAluno);

            // Chama a função responsável pela remoção do aluno no modelo
            const respostaModelo = await Aluno.removerAluno(idAluno);

            // Verifica se a remoção foi bem-sucedida
            if (respostaModelo) {
                return res.status(200).json({ mensagem: "Aluno removido com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao remover o Aluno. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao remover um Aluno. ${error}`);
            return res.status(400).json({ mensagem: "Erro ao remover o Aluno. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Atualiza os dados de um aluno no sistema.
     * @param req - Objeto da requisição contendo o ID do aluno e os novos dados.
     * @param res - Objeto da resposta HTTP que retorna o status da atualização.
     * @returns - Retorna uma resposta JSON indicando sucesso ou falha na operação.
     * @throws - Retorna um erro 400 caso ocorra falha na atualização dos dados do aluno.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            // Recupera o ID do aluno que será atualizado
            const idAluno = parseInt(req.params.idAluno);

            // Recupera os novos dados do aluno a partir do corpo da requisição
            const alunoRecebido: AlunoDTO = req.body;

            // Cria uma instância de Aluno com os novos dados recebidos
            const alunoAtualizado = new Aluno(
                alunoRecebido.nomeInteiro,
                alunoRecebido.cpf,
                alunoRecebido.email,
                alunoRecebido.celular
            );

            // Define o ID do aluno a ser atualizado
            alunoAtualizado.setIdAluno(idAluno);

            // Chama a função responsável por atualizar os dados do aluno
            const resposta = await Aluno.atualizarAluno(alunoAtualizado);

            // Verifica se a atualização foi bem-sucedida
            if (resposta) {
                return res.status(200).json({ mensagem: "Aluno atualizado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao atualizar o Aluno. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao atualizar um Aluno. ${error}`);
            return res.status(400).json({ mensagem: "Não foi possível atualizar o Aluno. Entre em contato com o administrador do sistema." });
        }
    }
}
