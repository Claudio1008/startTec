import { Request, Response, Router } from "express";
import AlunoController from "./controller/AlunoController";
import CursoController from "./controller/CursoController";
// Cria um roteador
const router = Router();

// Criando uma rota principal para a aplicação
router.get("/", (req: Request, res: Response) => {
    res.json({ mensagem: "Aplicação on-line" });
});

//ROTAS DOS CLIENTES

// Rota para listar os alunos
router.get("/lista/alunos", AlunoController.todos);
// Rota para criar um aluno
router.post("/novo/aluno", AlunoController.novo);
// Rota para atualizar um aluno
router.put("/delete/aluno/:idAluno", AlunoController.remover);
// Rota para deletar um cliente
router.put("/atualizar/aluno/:idAluno", AlunoController.atualizar);

//ROTA DOS VESTUÁRIOS

// Rota para listar os vestuário
router.get("/lista/cursos", CursoController.todos);
// Rota para criar um Vestuario
router.post("/novo/curso", CursoController.novo);
// Rota para deletar/ocultar um Vestuario
router.put("/delete/curso/:idCurso", CursoController.remover);
// Rota para atualizar um Vestuario
router.put("/atualizar/curso/:idCurso", CursoController.atualizar);
/*
//ROTA DAS VENDAS

// Rota para listar as vendas
router.get("/lista/vendas", VendaController.todos);
// Rota para cadastrar uma venda
router.post("/novo/venda", VendaController.novo);
//Rota para deletar uma venda
router.put("/delete/venda/:idVenda", VendaController.remover);
// Rota para atualizar uma venda
router.put("/atualizar/venda/:idVenda", VendaController.atualizar);
*/
export { router };