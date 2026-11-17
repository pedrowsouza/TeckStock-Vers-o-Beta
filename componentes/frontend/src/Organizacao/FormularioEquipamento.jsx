
import { useEffect, useState } from 'react';

function FormularioEquipamento({
    aoCadastrar,
    equipamentoEdicao,
    aoAtualizar
}) {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [numeroSerie, setNumeroSerie] = useState('');
    const [status, setStatus] = useState('disponivel');
    const [dataAquisicao, setDataAquisicao] = useState('');
    const [funcionarioResponsavel, setFuncionarioResponsavel] = useState('');

    useEffect(() => {
        if (equipamentoEdicao) {
            setNome(equipamentoEdicao.nome);
            setCategoria(equipamentoEdicao.categoria);
            setNumeroSerie(equipamentoEdicao.numero_serie);
            setStatus(equipamentoEdicao.status);
            setDataAquisicao(
                String(equipamentoEdicao.data_aquisicao).slice(0, 10)
            );
            setFuncionarioResponsavel(
                equipamentoEdicao.funcionario_responsavel || ''
            );
        } else {
            limparFormulario();
        }
    }, [equipamentoEdicao]);

    function limparFormulario() {
        setNome('');
        setCategoria('');
        setNumeroSerie('');
        setStatus('disponivel');
        setDataAquisicao('');
        setFuncionarioResponsavel('');
    }

    function alterarStatus(novoStatus) {
        setStatus(novoStatus);

        if (novoStatus !== 'emprestado') {
            setFuncionarioResponsavel('');
        }
    }

    async function enviarFormulario(evento) {
        evento.preventDefault();

        const equipamento = {
            nome,
            categoria,
            numero_serie: numeroSerie,
            status,
            data_aquisicao: dataAquisicao,
            funcionario_responsavel:
                status === 'emprestado'
                    ? funcionarioResponsavel.trim()
                    : null
        };

        if (equipamentoEdicao) {
            await aoAtualizar(equipamento);
        } else {
            await aoCadastrar(equipamento);
        }

        limparFormulario();
    }

    return (
        <section className="formulario">
            <h2>
                {equipamentoEdicao
                    ? 'Alterar status do equipamento'
                    : 'Cadastrar equipamento'}
            </h2>

            <form onSubmit={enviarFormulario}>
                {equipamentoEdicao ? (
                    <>
                        <label>Nome</label>
                        <input type="text" value={nome} readOnly />

                        <label>Categoria</label>
                        <input type="text" value={categoria} readOnly />

                        <label>Número de série</label>
                        <input type="text" value={numeroSerie} readOnly />

                        <label>Data de aquisição</label>
                        <input type="date" value={dataAquisicao} readOnly />
                    </>
                ) : (
                    <>
                        <label>Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            required
                        />

                        <label>Categoria</label>
                        <input
                            type="text"
                            value={categoria}
                            onChange={e => setCategoria(e.target.value)}
                            required
                        />

                        <label>Número de série</label>
                        <input
                            type="text"
                            value={numeroSerie}
                            onChange={e => setNumeroSerie(e.target.value)}
                            required
                        />

                        <label>Data de aquisição</label>
                        <input
                            type="date"
                            value={dataAquisicao}
                            onChange={e => setDataAquisicao(e.target.value)}
                            required
                        />
                    </>
                )}

                <label>Status</label>
                <select
                    value={status}
                    onChange={e => alterarStatus(e.target.value)}
                >
                    <option value="disponivel">Disponível</option>
                    <option value="emprestado">Emprestado</option>
                    <option value="manutencao">Em manutenção</option>
                </select>

                {status === 'emprestado' && (
                    <>
                        <label>Funcionário responsável</label>
                        <input
                            type="text"
                            value={funcionarioResponsavel}
                            onChange={e =>
                                setFuncionarioResponsavel(e.target.value)
                            }
                            placeholder="Digite o nome do funcionário"
                            required
                        />
                    </>
                )}

                <button type="submit">
                    {equipamentoEdicao
                        ? 'Salvar alterações'
                        : 'Cadastrar equipamento'}
                </button>
            </form>
        </section>
    );
}

export default FormularioEquipamento;
