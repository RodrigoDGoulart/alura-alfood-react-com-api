import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  useEffect(() => {
    // obter restaurantes
    axios.get<IPaginacao<IRestaurante>>('http://192.168.15.57:8000/api/v1/restaurantes/')
      .then(response => {
        setRestaurantes(response.data.results);
        setProximaPagina(response.data.next);
      })
      .catch(erro => {
        console.log(erro);
      });
  }, []);

  const avancarPagina = () => {
    axios.get<IPaginacao<IRestaurante>>(proximaPagina)
      .then(response => {
        console.log(response);
        setRestaurantes(response.data.results);
        setProximaPagina(response.data.next);
        setPaginaAnterior(response.data.previous);
      });
  }

  const voltarPagina = () => {
    axios.get<IPaginacao<IRestaurante>>(paginaAnterior)
    .then(resp => {
      setRestaurantes(resp.data.results);
      setProximaPagina(resp.data.next);
      setPaginaAnterior(resp.data.previous);
    })
    .catch(e => console.log(e));
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {paginaAnterior && <button onClick={voltarPagina}>
      Voltar página
    </button>}
    {proximaPagina && <button onClick={avancarPagina}>
      Próxima página
    </button>}
  </section>);
}

export default ListaRestaurantes;