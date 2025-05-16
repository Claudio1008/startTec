// Importa as dependências necessárias do Express
import { Request, Response } from "express";
// Importa a classe Venda do modelo correspondente
import { Matricula } from "../model/Matricula";

// Definição da estrutura de dados para a venda (DTO)
interface MatriculaDTO {
    idAluno: number,  // Identificador do cliente associado à venda
    idCurso: number,  // Identificador do vestuário vendido
    dataMatricula: Date,  // Data em que a venda ocorreu
    statusMatricula: string  // Status da venda (exemplo: 'concluída', 'pendente', etc.)
}

/**
 * A classe `VendaController` é responsável por controlar as requisições relacionadas às vendas.
 * 
 * Esta classe atua como um controlador dentro de uma API REST, gerenciando as operações relacionadas ao recurso "venda".
 */
export class MatriculaController {

    /**
     * Lista todas as vendas.
     * 
     * Este método é responsável por buscar e retornar todas as vendas cadastradas no banco de dados.
     * Se a consulta for bem-sucedida, a lista de vendas será retornada como resposta JSON.
     * Se não houver vendas ou ocorrer algum erro, uma mensagem de erro será retornada.
     * 
     * @param req Objeto de requisição HTTP contendo os dados da requisição.
     * @param res Objeto de resposta HTTP que será usado para enviar a resposta ao cliente.
     * @returns Lista de vendas em formato JSON com status 200 em caso de sucesso.
     * @throws Retorna um status 400 com uma mensagem de erro caso ocorra uma falha ao acessar a listagem de vendas.
     */
    static async todos(req: Request, res: Response): Promise<any> {
        try {
            // Acessa a função de listar as vendas e armazena o resultado em uma variável
            const listaDeMatriculas = await Matricula.listarMatriculas();

            // Verifica se a lista de vendas foi retornada com sucesso
            if (listaDeMatriculas) {
                // Retorna a lista de vendas em formato JSON com status 200
                return res.status(200).json(listaDeMatriculas);
            } else {
                // Caso não haja vendas, retorna uma mensagem de erro com status 404
                return res.status(404).json({ mensagem: "Nenhuma matricula encontrada." });
            }
        } catch (error) {
            // Em caso de erro, exibe uma mensagem no console para diagnóstico
            console.log('Erro ao acessar lista de matriculas');

            // Retorna uma resposta com status 400 e uma mensagem de erro
            return res.status(400).json({ mensagem: "Não foi possível acessar a listagem de matriculas" });
        }
    }

    /**
     * Cadastra uma nova venda no sistema.
     * 
     * Este método recebe os dados da venda enviados no corpo da requisição,
     * cria um novo objeto de venda e tenta cadastrá-lo no banco de dados.
     * 
     * @param req - Objeto de requisição HTTP contendo os dados da venda.
     * @param res - Objeto de resposta HTTP.
     * @returns - Retorna uma mensagem de sucesso com status 200 ou uma mensagem de erro com status 400.
     */
    static async novo(req: Request, res: Response): Promise<any> {
        try {
            // Recupera os dados da venda enviados no corpo da requisição
            const matriculaRecebida: MatriculaDTO = req.body;

            // Cria uma nova instância da Venda com os dados fornecidos
            const novaMatricula = new Matricula(
                matriculaRecebida.idAluno,   // Id do cliente
                matriculaRecebida.idCurso, // Id do vestuário
                matriculaRecebida.dataMatricula, // Data da venda
                matriculaRecebida.statusMatricula // Status da venda
            );

            // Chama a função responsável pelo cadastro da venda no banco de dados
            const respostaClasse = await Matricula.cadastroMatricula(novaMatricula);

            // Verifica se o cadastro foi realizado com sucesso
            if (respostaClasse) {
                // Retorna uma resposta HTTP 200 (OK) com uma mensagem de sucesso
                return res.status(200).json({ mensagem: "matricula cadastrada com sucesso!" });
            } else {
                // Retorna uma resposta HTTP 400 (Bad Request) com mensagem de erro
                return res.status(400).json({ mensagem: "Erro ao cadastrar matricula. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            // Lança uma mensagem de erro no console
            console.log('Erro ao cadastrar matricula:', error);

            // Retorna uma resposta HTTP 400 (Bad Request) com mensagem de erro genérica
            return res.status(400).json({ mensagem: "Não foi possível cadastrar a matricula. Entre em contato com o administrador do sistema." });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<any> {
        try {
            //recupera as inoformações a serem atualizadas no corpo da requisição
            const matriculaRecebido: MatriculaDTO = req.body;
            //recupera o ID do empréstimo a ser atualizado
            const idMatriculaRecebido = parseInt(req.params.idMatricula as string);

            //instanciando um objeto do tipo venda
            const matriculaAtualizada = new Matricula(
                matriculaRecebido.idAluno,
                matriculaRecebido.idCurso,
                matriculaRecebido.dataMatricula,
                matriculaRecebido.statusMatricula,
            );

            //adicionando o ID no objetoVendaAtualizado
            matriculaAtualizada.setIdMatricula(idMatriculaRecebido);

            //chamando a função de atualizar o empréstimo e guardando a resposta (booleano)
            const respostaModelo = await Matricula.atualizarMatricula(matriculaAtualizada);

            //verifica se a resposta é true
            if (respostaModelo) {
                //retorna um status 200 com uma mensagem de sucesso
                return res.status(200).json({ mensagem: "A matricula foi atualizado com sucesso!" })
            } else {
                //retorna um status 400 com uma mensagem de erro
                return res.status(400).json({ mensagem: "Não foi possível atualizar a venda. Entre em contato com o administrador do sistema." });
            }
        } catch (error) {
            //lança uma mensagem de erro no console
            console.log(`Erro ao atualizar a matricula. ${error}`);

            return res.status(400).json({ mensagem: "Não foi possível atualizar a matricula. Entre em contato com o administrador do sistema." });
        }
    }


    /**
    * Remove uma venda.
    * @param req Objeto de requisição HTTP com o ID da venda a ser removida.
    * @param res Objeto de resposta HTTP.
    * @returns Mensagem de sucesso ou erro em formato JSON.
    */
    static async remover(req: Request, res: Response): Promise<any> {
        try {
            // A primeira linha dentro do bloco try tenta pegar o parâmetro "idVenda" da requisição (req.params) e
            // converte ele para um número inteiro usando parseInt. O idVenda é o identificador da venda que se deseja remover.
            const idMatricula = parseInt(req.params.idMatricula);

            // A seguir, a função `removerVenda` da classe `Venda` é chamada. Ela provavelmente interage com o banco de dados
            // para tentar remover a venda com o ID fornecido. O resultado dessa operação é armazenado na variável `result`.
            const result = await Matricula.removerMatricula(idMatricula);

            // Se a operação de remoção foi bem-sucedida, `result` provavelmente será verdadeiro.
            // Nesse caso, o código retorna uma resposta HTTP com status 200 (OK) e uma mensagem de sucesso.
            if (result) {
                return res.status(200).json('Matricula removida com sucesso');
            } else {
                // Se o `result` não for verdadeiro (indica que algo deu errado na remoção), a resposta será um status 401 (não autorizado).
                // A mensagem que será enviada na resposta indica que houve um erro ao tentar deletar a venda.
                return res.status(401).json('Erro ao deletar matricula');
            }
        } catch (error) {
            // Caso ocorra algum erro inesperado durante a execução do código acima (por exemplo, erro de conexão com o banco de dados),
            // o erro será capturado aqui.

            console.log("Erro ao remover a Matricula"); // Essa linha imprime uma mensagem de erro no console para ajudar no diagnóstico.
            console.log(error); // Imprime os detalhes do erro no console (para depuração).

            // O código então retorna uma resposta com status 400 (Bad Request), que geralmente indica que algo deu errado no lado do cliente.
            // A resposta contém uma mensagem informando que a venda não pôde ser removida e orienta o usuário a entrar em contato com o administrador.
            return res.status(400).json({ mensagem: "Não foi possível remover a matricula. Entre em contato com o administrador do sistema." });
        }
    }
}
