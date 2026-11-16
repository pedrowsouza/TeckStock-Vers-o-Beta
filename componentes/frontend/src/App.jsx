
import './App.css';
import { useEffect, useState } from 'react';

import {
    buscarEquipamentos,
    cadastrarEquipamento,
    excluirEquipamento,
    atualizarEquipamento
} from './services/api';

import Equipamentos from './Organizacao/Equipamentos';
import FormularioEquipamento from './Organizacao/FormularioEquipamento';

function App() {
    const [equipamentos, setEquipamentos] = useState([]);
    const [equipamentoEdicao, setEquipamentoEdicao] = useState(null);

    const total = equipamentos.length;

    const disponiveis = equipamentos.filter(
        item => item.status === 'disponivel'
    ).length;

    const emprestados = equipamentos.filter(
        item => item.status === 'emprestado'
    ).length;

    const manutencao = equipamentos.filter(
        item => item.status === 'manutencao'
    ).length;

    async function carregarEquipamentos() {
        const dados = await buscarEquipamentos();
        setEquipamentos(dados.equipamentos);
    }

    async function handleCadastrar(equipamento) {
        try {
            await cadastrarEquipamento(equipamento);
            await carregarEquipamentos();

            alert('Equipamento cadastrado com sucesso!');
        } catch (erro) {
            alert('Erro ao cadastrar: ' + erro.message);
        }
    }

    async function handleExcluir(id) {
        const confirmar = window.confirm(
            'Deseja realmente excluir este equipamento?'
        );

        if (!confirmar) return;

        try {
            await excluirEquipamento(id);
            await carregarEquipamentos();

            alert('Equipamento excluído com sucesso!');
        } catch (erro) {
            alert('Erro ao excluir: ' + erro.message);
        }
    }

    function handleEditar(equipamento) {
    console.log(' ', equipamento);
    setEquipamentoEdicao(equipamento);
    alert('Atualize os status do equipamento!');
    }

    async function handleAtualizar(equipamento) {
        try {
            await atualizarEquipamento(
                equipamentoEdicao.id,
                equipamento
            );

            await carregarEquipamentos();
            setEquipamentoEdicao(null);

            alert('Equipamento atualizado com sucesso!');
        } catch (erro) {
            alert('Erro ao atualizar: ' + erro.message);
        }
    }

    useEffect(() => {
        carregarEquipamentos().catch(erro => {
            console.log('Erro:', erro.message);
        });
    }, []);

    return (
        <div className="container">
            <header className="cabecalho">
                <h1>TechStock</h1>
                <p>Sistema de controle de equipamentos</p>
            </header>

            <section className="resumo">
                <div className="card">
                    <h3>Total de equipamentos</h3>
                    <p>{total}</p>
                </div>

                <div className="card">
                    <h3>Disponíveis</h3>
                    <p>{disponiveis}</p>
                </div>

                <div className="card">
                    <h3>Emprestados</h3>
                    <p>{emprestados}</p>
                </div>

                <div className="card">
                    <h3>Em manutenção</h3>
                    <p>{manutencao}</p>
                </div>
            </section>

            <FormularioEquipamento
                aoCadastrar={handleCadastrar}
                equipamentoEdicao={equipamentoEdicao}
                aoAtualizar={handleAtualizar}
            />

            <Equipamentos
                equipamentos={equipamentos}
                aoExcluir={handleExcluir}
                aoEditar={handleEditar}
            />
        </div>
    );
}

export default App;


