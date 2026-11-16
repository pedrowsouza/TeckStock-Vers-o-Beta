
const API_URL = 'http://localhost:3000';

export async function buscarEquipamentos() {
    const resposta = await fetch(`${API_URL}/equipamentos?page=1&limit=100`);

    if (!resposta.ok) {
        throw new Error('Erro ao buscar equipamentos');
    }

    return await resposta.json();
}

export async function cadastrarEquipamento(equipamento) {
    console.log('Dados enviados para a API:', equipamento);

    const resposta = await fetch(`${API_URL}/equipamentos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipamento)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao cadastrar equipamento');
    }

    console.log('Resposta da API:', dados);

    return dados;
}

export async function excluirEquipamento(id) {
    const resposta = await fetch(`${API_URL}/equipamentos/${id}`, {
        method: 'DELETE'
    });

    if (!resposta.ok) {
        throw new Error('Erro ao excluir equipamento');
    }

    return await resposta.json();
}

export async function atualizarEquipamento(id, equipamento) {
    const resposta = await fetch(`${API_URL}/equipamentos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(equipamento)
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Erro ao atualizar equipamento');
    }

    return dados;
}
