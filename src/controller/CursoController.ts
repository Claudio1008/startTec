import { Curso } from "../model/Curso";
import { Request, Response} from "express";

/**
 * Interface LivroDTO
 * Define os atributos que devem ser recebidos do cliente nas requisições
 */
interface CursoDTO {
    nome: string;
    area: string;
    cargaHoraria: string;
    statusCurso: string
}

/**
 * Controlador para operações relacionadas aos Livros.
*/
class CursoController extends Curso {
    /**
     * Lista todos os livros.
     * @param req Objeto de requisição HTTP.
     * @param res Objeto de resposta HTTP.
     * @returns Lista de livros em formato JSON.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            const listaDeCursos = await Curso.listarCursos();

            res.status(200).json(listaDeCursos);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);

            res.status(400).json("Erro ao recuperar as informações do Curso");
        }
    }

    /**
     * Cadastra um novo livro.
     * @param req Objeto de requisição HTTP com os dados do aluno.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: CursoDTO = req.body;
            
            // Instanciando objeto Livro
            const novoCurso = new Curso(
                dadosRecebidos.nome,
                dadosRecebidos.area, 
                dadosRecebidos.cargaHoraria,
            );

            // Chama o método para persistir o livro no banco de dados
            const result = await Curso.cadastrarCurso(novoCurso);

            // Verifica se a query foi executada com sucesso
            if (result) {
                return res.status(200).json(`Curso cadastrado com sucesso`);
            } else {
                return res.status(400).json('Não foi possível cadastrar o Curso no banco de dados');
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o Curso: ${error}`);
            return res.status(400).json('Erro ao cadastrar o Curso');
        }
    }

     /**
     * Remove um aluno.
     * @param req Objeto de requisição HTTP com o ID do aluno a ser removido.
     * @param res Objeto de resposta HTTP.
     * @returns Mensagem de sucesso ou erro em formato JSON.
     */
     static async remover(req: Request, res: Response): Promise<any> {
        try {
            const idCurso= parseInt(req.query.idCurso as string);
            const result = await Curso.removerCurso(idCurso);
            
            if (result) {
                return res.status(200).json('Curso removido com sucesso');
            } else {
                return res.status(401).json('Erro ao deletar Curso');
            }
        } catch (error) {
            console.log("Erro ao remover o Curso");
            console.log(error);
            return res.status(500).send("error");
        }
    }
    
    /**
     * Método para atualizar o cadastro de um livro.
     * 
     * @param req Objeto de requisição do Express, contendo os dados atualizados do aluno
     * @param res Objeto de resposta do Express
     * @returns Retorna uma resposta HTTP indicando sucesso ou falha na atualização
     */
    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            const dadosRecebidos: CursoDTO = req.body;
            
            // Cria uma nova instância de Livro com os dados atualizados
            const curso = new Curso(
                dadosRecebidos.nome,
                dadosRecebidos.area, 
                dadosRecebidos.cargaHoraria
            );

            // Define o ID do livro, que deve ser passado na query string
            Curso.setIdCurso(parseInt(req.query.idCurso as string));

            // Chama o método para atualizar o cadastro do livro no banco de dados
            if (await Curso.atualizarCadastroCurso(curso)) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json('Não foi possível atualizar o livro no banco de dados');
            }
        } catch (error) {
            // Caso ocorra algum erro, este é registrado nos logs do servidor
            console.error(`Erro no modelo: ${error}`);
            // Retorna uma resposta com uma mensagem de erro
            return res.json({ mensagem: "Erro ao atualizar aluno." });
        }
    }
}

export default CursoController;


