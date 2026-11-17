
const express = require('express');
const pool = require('../banco_dados/db');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// LISTAR EQUIPAMENTOS COM PAGINAÇÃO
app.get('/equipamentos', async (request, response) => {
    try {
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;
        const offset = (page - 1) * limit;

        const resultado = await pool.query(
            'SELECT * FROM equipamentos ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const total = await pool.query(
            'SELECT COUNT(*) FROM equipamentos'
        );

        const totalEquipamentos = Number(total.rows[0].count);
        const totalPaginas = Math.ceil(totalEquipamentos / limit);

        response.status(200).json({
            pagina: page,
            limite: limit,
            totalEquipamentos,
            totalPaginas,
            equipamentos: resultado.rows
        });

    } catch (erro) {
        console.log('Erro ao buscar equipamentos:', erro.message);

        response.status(500).json({
            erro: 'Não foi possível encontrar os equipamentos'
        });
    }
});

// CADASTRAR EQUIPAMENTO
app.post('/equipamentos', async (request, response) => {
    try {
        const {
            nome,
            categoria,
            numero_serie,
            status,
            data_aquisicao,
            funcionario_responsavel
        } = request.body;

        if (status === 'emprestado' && !funcionario_responsavel?.trim()) {
            return response.status(400).json({
                erro: 'Informe o nome do funcionário responsável'
            });
        }

        const funcionario = status === 'emprestado'
            ? funcionario_responsavel.trim()
            : null;

        const resultado = await pool.query(
            `INSERT INTO equipamentos
            (nome, categoria, numero_serie, status, data_aquisicao, funcionario_responsavel)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                nome,
                categoria,
                numero_serie,
                status,
                data_aquisicao,
                funcionario
            ]
        );

        response.status(201).json(resultado.rows[0]);

    } catch (erro) {
        console.log('Erro ao cadastrar:', erro.message);

        response.status(500).json({
            erro: 'Não foi possível cadastrar o equipamento'
        });
    }
});

// ATUALIZAR STATUS E FUNCIONÁRIO RESPONSÁVEL
app.put('/equipamentos/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const { status, funcionario_responsavel } = request.body;

        if (status === 'emprestado' && !funcionario_responsavel?.trim()) {
            return response.status(400).json({
                erro: 'Informe o nome do funcionário responsável'
            });
        }

        const funcionario = status === 'emprestado'
            ? funcionario_responsavel.trim()
            : null;

        const resultado = await pool.query(
            `UPDATE equipamentos
            SET status = $1,
                funcionario_responsavel = $2
            WHERE id = $3
            RETURNING *`,
            [status, funcionario, id]
        );

        if (resultado.rows.length === 0) {
            return response.status(404).json({
                erro: 'Equipamento não encontrado'
            });
        }

        response.status(200).json(resultado.rows[0]);

        console.log('Equipamento atualizado com sucesso');

    } catch (erro) {
        console.log('Erro ao atualizar:', erro.message);

        response.status(500).json({
            erro: 'Não foi possível atualizar o equipamento'
        });
    }
});

// EXCLUIR EQUIPAMENTO
app.delete('/equipamentos/:id', async (request, response) => {
    try {
        const id = request.params.id;

        const resultado = await pool.query(
            `DELETE FROM equipamentos
            WHERE id = $1
            RETURNING *`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return response.status(404).json({
                erro: 'Equipamento não encontrado'
            });
        }

        response.status(200).json(resultado.rows[0]);

        console.log('Equipamento deletado com sucesso');

    } catch (erro) {
        console.log('Erro ao deletar:', erro.message);

        response.status(500).json({
            erro: 'Não foi possível deletar o equipamento'
        });
    }
});

// INICIAR SERVIDOR
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
