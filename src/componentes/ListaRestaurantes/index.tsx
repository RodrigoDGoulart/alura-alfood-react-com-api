import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import { TextField } from '@mui/material';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [pesquisa, setPesquisa] = useState('');

  useEffect(() => {
    // obter restaurantes
    axios.get<IPaginacao<IRestaurante>>('http://192.168.15.57:8000/api/v1/restaurantes/')
      .then(response => {
        setRestaurantes(response.data.results.filter(restaurante => {
          const regex = new RegExp(pesquisa, 'i');
          return regex.test(restaurante.nome);
        }));
        setProximaPagina(response.data.next);
      })
      .catch(erro => {
        console.log(erro);
      });
  }, [pesquisa]);

  const verMais = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina)
      .then(response => {
        console.log(response);
        setRestaurantes([...restaurantes, ...response.data.results]);
        setProximaPagina(response.data.next);
      });
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <TextField
      fullWidth
      label="Procure o restaurante pelo nome"
      variant='standard'
      value={pesquisa}
      onChange={(e) => setPesquisa(e.target.value)}
    />
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {proximaPagina && <button onClick={verMais}>
      Ver mais
    </button>}
  </section>);
}

export default ListaRestaurantes;