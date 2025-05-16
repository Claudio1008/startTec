// Importa as definições de Request e Response do Express
import { Request, Response } from "express";

// Importa a classe Curso do modelo correspondente
import { Curso } from "../model/Curso";

// Define a interface para representar os dados de um curso
interface CursoDTO {
    nome: string; // Nome do curso
    area: string; // Área de conhecimento do curso
    cargaHoraria: number; // Carga horária total do curso
}

/**
 * Controlador para gerenciar as operações de Curso na API.
 * Esta classe herda de `Curso` e implementa métodos para CRUD de cursos.
 */
export class CursoController extends Curso {

    /**
     * Lista todos os cursos disponíveis no sistema.
     * @param req - Objeto da requisição HTTP.
     * @param res - Objeto da resposta HTTP.
     * @returns - Retorna a lista de cursos em formato JSON com status 200 ou uma mensagem de erro com status 400.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Chama o método do modelo que retorna a listagem de cursos
            const listaDeCursos = await Curso.listagemCursos();

            // Retorna a lista em formato JSON com status de sucesso
            return res.status(200).json(listaDeCursos);
        } catch (error) {
            // Exibe erro no console para depuração
            console.log('Erro ao acessar listagem de cursos:', error);

            // Retorna erro 400 com mensagem apropriada
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de cursos" });
        }
    }

    /**
     * Cadastra um novo curso no sistema.
     * @param req - Objeto da requisição contendo os dados do curso no corpo.
     * @param res - Objeto da resposta HTTP.
     * @returns - Retorna mensagem de sucesso ou erro com status apropriado.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Extrai os dados do curso do corpo da requisição
            const cursoRecebido: CursoDTO = req.body;

            // Cria uma nova instância de Curso com os dados recebidos
            const novoCurso = new Curso(
                cursoRecebido.nome,         // Nome do curso
                cursoRecebido.area,         // Área do curso
                cursoRecebido.cargaHoraria  // Carga horária
            );

            // Chama o método do modelo para cadastrar o curso
            const respostaClasse = await Curso.cadastroCurso(novoCurso);

            // Verifica se o cadastro foi bem-sucedido
            if (respostaClasse) {
                return res.status(200).json({ mensagem: "Curso cadastrado com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao cadastrar o Curso. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Loga o erro no console
            console.log('Erro ao cadastrar Curso:', error);

            // Retorna resposta de erro
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o Curso. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Remove um curso do sistema com base no ID fornecido.
     * @param req - Objeto da requisição contendo o ID do curso como parâmetro.
     * @param res - Objeto da resposta HTTP.
     * @returns - Retorna mensagem de sucesso ou erro.
     */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            // Obtém o ID do curso a ser removido via parâmetro de rota
            const idCurso = parseInt(req.params.idCurso);

            // Chama o método de remoção no modelo
            const respostaModelo = await Curso.removerCurso(idCurso);

            // Verifica se a remoção foi bem-sucedida
            if (respostaModelo) {
                return res.status(200).json({ mensagem: "Curso removido com sucesso!" });
            } else {
                return res.status(400).json({ mensagem: "Erro ao remover o Curso. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Mostra erro no console (a interpolação aqui está incorreta, veja observação abaixo)
            console.log('Erro ao remover um Curso. ${error}'); // ⚠️ Este log não exibirá corretamente o erro

            // Retorna mensagem de erro
            return res.status(400).json({ mensagem: "Erro ao remover o Curso. Entre em contato com o administrador do sistema." });
        }
    }

    /**
     * Atualiza os dados de um curso já existente.
     * @param req - Objeto da requisição contendo o ID do curso e os novos dados.
     * @param res - Objeto da resposta HTTP.
     * @returns - Mensagem de sucesso ou erro com status HTTP adequado.
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            // Extrai o ID do curso da URL
            const idCurso = parseInt(req.params.idCurso);

            // Obtém os novos dados do corpo da requisição
            const cursoRecebido: CursoDTO = req.body;

            // Cria um objeto Curso com os novos dados
            const cursoAtualizado = new Curso(
                cursoRecebido.nome,
                cursoRecebido.area,
                cursoRecebido.cargaHoraria
            );

            // Define o ID do curso no objeto
            cursoAtualizado.setIdCurso(idCurso);

            // Executa o método de atualização no modelo
            const resposta = await Curso.atualizaCurso(cursoAtualizado);

            // Verifica se a atualização foi realizada com sucesso
            if (resposta) {
                return res.status(200).json({ mensagem: "curso atualizado com sucesso!" }); // ⚠️ Inconsistência de capitalização
            } else {
                return res.status(400).json({ mensagem: "Erro ao atualizar o curso. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Exibe o erro para fins de debug
            console.log(`Erro ao atualizar um curso. ${error}`);

            // Retorna resposta de erro
            return res.status(400).json({ mensagem: "Não foi possível atualizar o curso. Entre em contato com o administrador do sistema." });
        }
    }
}
