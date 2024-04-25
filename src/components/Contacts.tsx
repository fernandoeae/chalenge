import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getLatLngFromAddress } from '../api/geoCode';

interface Contact {
  id: number;
  nome: string;
  cpf: string;
  localidade: string; // Cidade
  uf: string; // Estado
  telefone: string;
  endereco: string;
  cep: string;
  latitude: number;
  longitude: number;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [addressInfo, setAddressInfo] = useState<any>(null);
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cpfValid, setCpfValid] = useState<boolean | null>(null);
  const [cpfInput, setCpfInput] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const openSuccessSnackbar = (message: any) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };


  const openErrorSnackbar = (message: any) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };



  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const saveContactsToLocalStorage = (updatedContacts: Contact[]) => {
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  };

  const validateAndSetCpf = (value: string) => {

    const isValid = cpfValidator.isValid(value); // Usando o método 'isValid' corretamente
    let verify = '';
    const contactString = localStorage.getItem('contacts');
    const contacts: { cpf: string }[] = contactString ? JSON.parse(contactString) : [];

    // Verifica se o cpf de usuário já existe
    if (contacts.find(client => client.cpf === value)) {

      openErrorSnackbar('Cpf Já cadastrado no sistema');
      verify = 'false';

    } else {
      setCpfValue(value);
      setCpfValid(isValid);
      verify = 'true';
    }
    return verify

  };

  const filteredContacts = contacts.filter((contact) => {
    return contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.cpf.includes(searchTerm);
  });




  const handleCepChange = async (value: string) => {
    setCep(value);
    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();

        setAddressInfo(data);
        if (!data.erro) {
          setEndereco(data.logradouro);
          setLocalidade(data.localidade);
          setUf(data.uf);

          // Obter latitude e longitude do endereço
          const { latitude, longitude } = await getLatLngFromAddress(`${data.logradouro}, ${data.localidade}, ${data.uf}`);
          setLatitude(latitude);
          setLongitude(longitude);
        }
      } catch (error) {
        console.error('Erro ao consultar o CEP:', error);
        setAddressInfo(null);
      }
    } else {
      setAddressInfo(null);
    }
  };


  const handleAddContact = () => {
    if (nome
      && cpfValue
      && (cpfValidator.isValid(cpfValue))
    ) {
      const newContact: Contact = {
        id: contacts.length + 1,
        nome,
        cpf: cpfValue,
        localidade,
        uf,
        telefone,
        endereco,
        cep,
        latitude,
        longitude,
      };
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      saveContactsToLocalStorage(updatedContacts);
      setNome('');
      setCpfValue('');
      setLocalidade('');
      setUf('');
      setTelefone('');
      setEndereco('');
      setCep('');
      setLatitude(0);
      setLongitude(0);
    }
  };

  return (
    <div className='top'>
      <h1>Contatos</h1>

      <Grid container spacing={2}>
        <Grid item xs={4}>

          <TextField
            label="Nome" size="small"
            value={nome}
            sx={{ mx: 2 }}
            onChange={(e) => setNome(e.target.value)}
            variant="outlined"
            margin="normal"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={4}>

          <TextField
            label="CPF"
            size="small"
            sx={{ mx: 2 }}
            value={cpfValue}
            onChange={(e) => validateAndSetCpf(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            error={cpfValue !== '' && !cpfValid}
            helperText={cpfValue !== '' && !cpfValid ? "CPF inválido" : ""}
            required
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Telefone"
            size="small"
            value={telefone}
            fullWidth
            sx={{ mx: 2 }}
            onChange={(e) => setTelefone(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="CEP"
            size="small"
            value={cep}
            sx={{ mx: 2 }}
            fullWidth
            onChange={(e) => handleCepChange(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Estado"
            size="small"
            sx={{ mx: 2 }}
            fullWidth
            value={uf}
            variant="outlined"
            margin="normal"
            disabled
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Cidade"
            sx={{ mx: 2 }}
            fullWidth
            size="small"
            value={localidade}
            variant="outlined"
            margin="normal"
            disabled
          />

        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Endereço"
            size="small"
            value={endereco}
            sx={{ mx: 2 }}
            fullWidth
            onChange={(e) => setEndereco(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Latitude"
            size="small"
            type="number"
            value={latitude}
            fullWidth
            sx={{ mx: 2 }}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            variant="outlined"
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Longitude"
            size="small"
            type="number"
            value={longitude}
            fullWidth
            sx={{ mx: 2 }}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            variant="outlined"
            margin="normal"
          />
        </Grid>
      </Grid>


      <Button variant="contained" color="primary" onClick={handleAddContact}>
        Adicionar Contato
      </Button>


      <TextField
        label="Pesquisar por CPF ou Nome"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Endereço</TableCell>
            <TableCell>CEP</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                {editingContactId === contact.id ? (
                  <TextField
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                ) : (
                  contact.nome
                )}
              </TableCell>
              <TableCell>
                {editingContactId === contact.id ? (
                  <TextField
                    value={cpfInput}
                    onChange={(e) => {
                      setCpfInput(e.target.value);

                    }}
                    onBlur={(e) => validateAndSetCpf(e.target.value)}
                    error={cpfValue !== '' && !cpfValid}
                    helperText={cpfValue !== '' && !cpfValid ? "CPF inválido" : ""}
                  />

                ) : (
                  contact.cpf
                )}


              </TableCell>
              <TableCell>
                {editingContactId === contact.id ? (
                  <TextField
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                ) : (
                  contact.telefone
                )}
              </TableCell>
              <TableCell>
                {editingContactId === contact.id ? (
                  <TextField
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                ) : (
                  contact.endereco
                )}
              </TableCell>
              <TableCell>
                {editingContactId === contact.id ? (
                  <TextField
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                  />
                ) : (
                  contact.cep
                )}
              </TableCell>
              <TableCell>{contact.latitude}</TableCell>
              <TableCell>{contact.longitude}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Contacts;
