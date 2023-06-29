import axios from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [ordem, setOrdem] = useState<string>('');

  const ordenar = (parametro: string) => {
    if (parametro === 'Id') {
      const restaurantesSort = restaurantes.sort((a, b) => a.id - b.id);
      setRestaurantes(restaurantesSort);
    } else if (parametro === 'Nome') {
      const restaurantesSort = restaurantes.sort((a, b) => a.nome.localeCompare(b.nome));
      setRestaurantes(restaurantesSort);
    }
  }

  useEffect(() => {
    // obter restaurantes
    axios.get<IPaginacao<IRestaurante>>('http://192.168.15.57:8000/api/v1/restaurantes/')
      .then(response => {
        const restNome = response.data.results.filter(restaurante => {
          const regex = new RegExp(pesquisa, 'i');
          return regex.test(restaurante.nome);
        });
        setRestaurantes(restNome);
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
    <div className={style['search-container']}>
      <TextField
        fullWidth
        label="Procure o restaurante pelo nome"
        variant='standard'
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />
      <FormControl variant='standard' sx={{ minWidth: 220 }}>
        <InputLabel htmlFor='ordem-input'>
          Ordenar por
        </InputLabel>
        <Select
          inputProps={{
            id: 'ordem-input'
          }}
          value={ordem}
          onChange={(e: SelectChangeEvent) => {
            ordenar(e.target.value);
            setOrdem(e.target.value);
          }}
          label="Age"
        >
          <MenuItem value={'Id'}>
            <em>Id</em>
          </MenuItem>
          <MenuItem value={'Nome'}>
            <em>Nome</em>
          </MenuItem>
        </Select>
      </FormControl>
    </div>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {proximaPagina && <button onClick={verMais}>
      Ver mais
    </button>}
  </section>);
}

export default ListaRestaurantes;