import { useEffect, useState } from "react"
import IRestaurante from "../../../interfaces/IRestaurante"
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Button } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdministracaoRestaurantes() {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);

  useEffect(() => {
    axios.get<IRestaurante[]>("http://localhost:8000/api/v2/restaurantes/")
      .then(resp => setRestaurantes(resp.data))
  }, []);

  const excluir = (restaurante: IRestaurante) => {
    axios.delete(`http://localhost:8000/api/v2/restaurantes/${restaurante.id}/`)
      .then(() => {
        const listaRestaurante = restaurantes.filter(rest => rest.id !== restaurante.id);
        setRestaurantes([ ...listaRestaurante ]);
      });
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Nome
            </TableCell>
            <TableCell>
              Editar
            </TableCell>
            <TableCell>
              Excluir
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantes.map(restaurante => (
            <TableRow key={restaurante.id}>
              <TableCell>
                {restaurante.nome}
              </TableCell>
              <TableCell>
                [ <Link to={`/admin/restaurantes/${restaurante.id}`}>Editar</Link> ]
              </TableCell>
              <TableCell>
                <Button
                variant="outlined"
                color="error"
                onClick={() => excluir(restaurante)}>
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}