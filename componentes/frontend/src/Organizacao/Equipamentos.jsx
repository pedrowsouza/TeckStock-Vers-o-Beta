
function Equipamentos({ equipamentos, aoExcluir, aoEditar }) {
    return (
        <section className="equipamentos">
            <h2>Lista de equipamentos</h2>

            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Número de série</th>
                        <th>Status</th>
                        <th>Funcionário responsável</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {equipamentos.map(item => (
                        <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>{item.categoria}</td>
                            <td>{item.numero_serie}</td>
                            <td>{item.status}</td>

                            <td>
                                {item.status === 'emprestado'
                                    ? item.funcionario_responsavel
                                    : item.status === 'disponivel'
                                        ? 'Está na empresa'
                                        : 'Em manutenção'}
                            </td>

                            <td>
                                <button onClick={() => aoEditar(item)}>
                                    Editar
                                </button>

                                <button onClick={() => aoExcluir(item.id)}>
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Equipamentos;
