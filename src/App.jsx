import React, { useEffect, useState } from 'react';
import './App.css';

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
    fetch('http://localhost:3000/products')
      .then(response => response.json())
      .then(result => {
        setProdutos(result);
        setCarregando(false);
      })
      .catch(error => {
        console.error('Erro ao carregar produtos:', error);
        setCarregando(false);
      });
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
    setNome(item?.name);
    setDescricao(item?.description);
    setPreco(item?.price);
    setAbrir(true);
  };

  const salvarProduto = async () => {
    let obj = { name: nome, description: descricao, price: preco };
    if (id) {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
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
        const response = await fetch('http://localhost:3000/products', {
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
      const response = await fetch(`http://localhost:3000/products/${id}`, {
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
    <div className="App flex flex-col gap-5 w-[1157px]">
      <h1>Gestão de Produtos</h1>
      <button className='w-[200px]' onClick={onClickAdicionarProduto}>Adicionar Produto</button>
      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul className='flex flex-col gap-2'>
          {produtos.map(produto => (
            <li className='flex gap-5 justify-between' key={produto.id}>
              {`Nome: ${produto.name}`} - {`Descrição: ${produto.description}`} - {`Preço: R$ ${produto.price}`}
              <div className='flex gap-5 '>
                <button onClick={() => onClickEditar(produto)}>
                  <p>Editar</p>
                </button>
                <button onClick={() => deletarProduto(produto.id)}>
                 <p>Deletar</p>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {abrir && (
        <div className="modal flex gap-2 items-center ">
          <h2>{id ? 'Editar Produto' : 'Adicionar Produto'}</h2>
          <label>
            Nome:
            <input className='outline-0 pl-[2px]' value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>
          <label>
            Descrição:
            <input className='outline-0 pl-[2px]' value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </label>
          <label>
            Preço:
            <input  className='outline-0 pl-[2px]' type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
          </label>
          <button onClick={salvarProduto}>{id ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
          <button onClick={() => setAbrir(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default App;
