import { Request, Response } from "express";
import { Matricula } from "../model/Matricula";

// Interface para representar os dados recebidos na requisição de matrícula
interface MatriculaDTO {
    idAluno: number,
    idCurso: number,
    dataMatricula: Date,
    statusMatricula: string
}

/**
 * Controlador responsável por lidar com requisições relacionadas às matrículas.
 * Herda os métodos da classe `Matricula`, que provavelmente lida com as regras de negócio e acesso a dados.
 */
export class MatriculaController extends Matricula {

    /**
     * Lista todas as matrículas ativas.
     * @param req Objeto da requisição HTTP.
     * @param res Objeto da resposta HTTP.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método de listagem da classe Matricula
            const listaDeMatriculas = await Matricula.listarMatricula();
            // Retorna a lista com status 200
            return res.status(200).json(listaDeMatriculas);
        } catch (error) {
            console.log('Erro ao acessar listagem de Matriculas');
            // Retorna erro com status 400
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de Matriculas" });
        }
    }

    /**
     * Cadastra uma nova matrícula.
     * @param req Objeto da requisição HTTP contendo os dados no corpo (body).
     * @param res Objeto da resposta HTTP.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Obtém os dados da matrícula a partir do corpo da requisição
            const MatriculaRecebido: MatriculaDTO = req.body;

            // Cria uma nova instância da matrícula com os dados recebidos
            const novoMatricula = new Matricula(
                MatriculaRecebido.idAluno,
                MatriculaRecebido.idCurso,
                MatriculaRecebido.dataMatricula,
                MatriculaRecebido.statusMatricula
            );

            // Chama o método de cadastro na classe Matricula
            const repostaClasse = await Matricula.cadastroMatricula(novoMatricula);

            // Verifica se o cadastro foi bem-sucedido
            if (repostaClasse) {
                return res.status(200).json({ mensagem: "Matriculas cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastra o Matriculas. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar um Matriculas. ${error}`);
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o Matriculas. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Remove uma matrícula existente.
     * @param req Objeto da requisição HTTP contendo o ID da matrícula na URL.
     * @param res Objeto da resposta HTTP.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            // Recupera o ID da matrícula a ser removida a partir dos parâmetros da URL
            const idMatricula = parseInt(req.params.idMatricula as string);

            // Chama o método de remoção na classe Matricula
            const respostaModelo = await Matricula.removerMatricula(idMatricula);

            // Verifica se a remoção foi bem-sucedida
            if (respostaModelo) {
                return res.status(200).json({ mensagem: "Matricula removido com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao remover o Matricula. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao remover um Matricula. ${error}`);
            return res.status(400).json({ mensagem: "Não foi possível remover o Matricula. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Atualiza os dados de uma matrícula existente.
     * @param req Objeto da requisição HTTP contendo o ID da matrícula na URL e os novos dados no corpo da requisição.
     * @param res Objeto da resposta HTTP.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            // Recupera o ID da matrícula a ser atualizada
            const idMatricula = parseInt(req.params.idMatricula as string);

            // Recupera os novos dados da matrícula
            const matriculaRecebido: MatriculaDTO = req.body;

            // Cria uma nova instância da matrícula com os dados atualizados
            const matriculaAtualizado = new Matricula(
                matriculaRecebido.idAluno,
                matriculaRecebido.idCurso,
                matriculaRecebido.dataMatricula,
                matriculaRecebido.statusMatricula
            );

            // Define o ID da matrícula que será atualizada
            matriculaAtualizado.setIdMatricula(idMatricula);

            // Chama o método de atualização
            const resposta = await Matricula.atualizarMatricula(matriculaAtualizado);

            // Verifica se a atualização foi bem-sucedida
            if (resposta) {
                return res.status(200).json({ mensagem: "Matricula atualizado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao atualizar o Matricula. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            console.log(`Erro ao atualizar um Matricula. ${error}`);
            return res.status(400).json({ mensagem: "Não foi possível atualizar o Matricula. Entre em contato com o administrador do sistema." });
        }
    }
}
