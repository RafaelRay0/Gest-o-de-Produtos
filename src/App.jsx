import React, { useEffect, useState } from 'react';
import './App.css';
const icon = "src/assets/editar.png"
const bin = "src/assets/bin.png"
function App() {
  const [produtos, setProdutos] = useState([]);
  const [id, setId] = useState('');
  const [abrir, setAbrir] = useState(false);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = () => {
    setCarregando(true);
    fetch('http://localhost:4000/produtos')
      .then(response => response.json())
      .then(result => {
        setProdutos(result);
      })
      .catch(error => {
        console.error('Erro ao carregar produtos:', error);
      });
    setCarregando(false);
  };

  const onClickAdicionarProduto = () => {
    setId('');
    setNome('');
    setDescricao('');
    setPreco('');
    setAbrir(true);
  };

  const onClickEditar = (item) => {
    setId(item?.id);
    setNome(item?.nome);
    setDescricao(item?.descricao);
    setPreco(item?.preco);
    setAbrir(true)
  };

  const salvarProduto = async () => {
    let obj = { nome: nome, descricao: descricao, preco: preco };
    if (id) {
      try {
        const response = await fetch(`http://localhost:4000/produtos/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        });
        if (response.ok) {
          alert('Produto atualizado com sucesso!');
          setAbrir(false);
        } else {
          alert('Erro ao atualizar produto');
        }
      } catch (error) {
        alert('Erro ao atualizar produto:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:4000/produtos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(obj)
        });
        if (response.ok) {
          alert('Produto salvo com sucesso!');
          setAbrir(false);
        } else {
          alert('Erro ao salvar produto');
        }
      } catch (error) {
        alert('Erro ao salvar produto:', error);
      }
    }
    carregarProdutos();
  };

  const deletarProduto = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/produtos/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Produto deletado com sucesso!');
        setProdutos(produtos.filter(produto => produto.id !== id));
      } else {
        alert('Erro ao deletar produto');
      }
    } catch (error) {
      alert('Erro ao deletar produto:', error);
    }
  };

  return (
    <div className="App flex flex-col gap-5 w-[1157px] ">
      <h1 className='mb-[40px]'>Gestão de Produtos</h1>
      <a href="#adicionar">
        <button className='w-[200px] bg-green-600 text-black ml-[956px]' onClick={onClickAdicionarProduto}>
          <p>Adicionar Produto</p>
        </button>
      </a>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul className='flex flex-col gap-2'>
          {produtos?.map((item, index) => (
            <li className='border border-gray-600 p-4 rounded-lg flex flex-col items-start flex-wrap gap-5 justify-between ' key={index}>
              <p className='font-bold text-[18px]'>Nome: {item?.nome}</p>
              <small>Descrição: <span className='text-yellow-300'>{item?.descricao}</span> | Preço: <span className='text-lime-500'>R${item?.preco}</span></small>
              <small>Dt. de Criação: {item?.data_de_criacao}</small>
              <div id='teste' className='flex gap-3'>
                <a href="#adicionar">
                  <button className='bg-slate-700' onClick={() => onClickEditar(item)}>
                    <img className='w-[30px]' src={icon} alt="icon-editar" />
                  </button>
                </a>
                <button className='bg-red-500' onClick={() => deletarProduto(item.id)}>
                  <img src={bin} alt="" />
                </button>
              </div>
              <hr />
            </li>
          ))}
        </ul>
      )}
      {abrir && (
        
        <div className="modal flex gap-2 items-center justify-center">
          <h2 id='adicionar' className='text-lime-700'>{id ? 'Editar Produto' : 'Adicionar Produto'}</h2>
          <label>
            Nome:
            <input className='outline-0 pl-[2px] ' value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>
          <label>
            Descrição: 
            <input className='outline-0 pl-[2px] ' value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </label>
          <label>
            Preço:
            <input className='outline-0 pl-[2px] ' type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
          </label>
          <a href="#root"><button onClick={salvarProduto}>{id ? 'Salvar Alterações' : 'Adicionar Produto'}</button></a>
          <a href="#root"><button onClick={() => setAbrir(false)}>Cancelar</button></a>
        </div>
      )}
    </div>
  );
}

export default App;
