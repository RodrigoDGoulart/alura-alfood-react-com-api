import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useParams } from "react-router-dom";
import IPrato from "../../../interfaces/IPrato";

export default function FormularioPrato() {
  const {id} = useParams();

  const [nomePrato, setNomePrato] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tag, setTag] = useState('');
  const [restaurante, setRestaurante] = useState('');
  const [imagem, setImagem] = useState<File | null>(null);
  
  const [tags, setTags] = useState<ITag[]>([]);
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);


  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formData = new FormData();
    formData.append('nome', nomePrato);
    formData.append('descricao', descricao);
    formData.append('tag', tag);
    formData.append('restaurante', restaurante);
    imagem && formData.append('imagem', imagem);

    http.request({
      url: id ? `pratos/${id}/` : 'pratos/',
      method: id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }).then(() => {
      if (!id) {
        setNomePrato('');
        setDescricao('');
        setTag('');
        setRestaurante('');
        alert('Prato cadastrado com sucesso!');
      } else {
        alert('Prato atualizado com sucesso!');
      }
    }).catch(erro => console.log(erro));
  }

  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/')
    .then(resposta => {
      setTags(resposta.data.tags);
    });
    http.get<IRestaurante[]>('restaurantes/')
    .then(resposta => {
      setRestaurantes(resposta.data);
    });
    if (id) {
      http.get<IPrato>(`/pratos/${id}/`)
      .then(async resposta => {
        setNomePrato(resposta.data.nome);
        setDescricao(resposta.data.descricao);
        setTag(resposta.data.tag);
        setRestaurante(`${resposta.data.restaurante}`);
      });
    }
  }, [id]);
  return (
    <>
      <Typography
        component="h1"
        variant="h6"
      >
        Formulário de pratos
      </Typography>
      <Box
        component="form"
        sx={{ width: '100%' }}
        onSubmit={aoSubmeterForm}>
        <TextField
          value={nomePrato}
          onChange={evento => setNomePrato(evento.target.value)}
          label="Nome do prato"
          variant="standard"
          fullWidth
          required
          margin='dense' />
        <TextField
          value={descricao}
          onChange={evento => setDescricao(evento.target.value)}
          label="Descrição"
          variant="standard"
          fullWidth
          required
          margin='dense' />

        <FormControl
        variant="standard"
        margin='dense'
        fullWidth >
          <InputLabel id='select-tag'>Tag</InputLabel>
          <Select labelId='select-tag' value={tag} onChange={evento => setTag(evento.target.value)}>
            {tags.map(tag => (
              <MenuItem key={tag.id} value={tag.value}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
        variant="standard"
        margin='dense'
        fullWidth >
          <InputLabel id='select-restaurante'>Restaurante</InputLabel>
          <Select labelId='select-restaurante' value={restaurante} onChange={evento => setRestaurante(evento.target.value)}>
            {restaurantes.map(restaurante => (
              <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <input type="file" onChange={evento => evento.target.files?.length && setImagem(evento.target.files[0])} />

        <Button
          sx={{ marginTop: 1 }}
          variant="outlined"
          fullWidth
          type="submit">
          Salvar
        </Button>
      </Box>
    </>
  );
}