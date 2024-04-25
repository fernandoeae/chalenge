import React, { useState, useEffect } from 'react';
import {
  TextField,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SaveIcon from '@mui/icons-material/Save';
import { cpf as cpfValidator } from 'cpf-cnpj-validator'; // Renomeando o método 'cpf' para 'cpfValidator'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getLatLngFromAddress } from '../api/geoCode';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MapWithMarker } from './GoogleMapReact'

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

const ListContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [nome, setNome] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [latitudeGeo, setLatitudeGeo] = useState(0);
  const [longitudeGeo, setLongitudeGeo] = useState(0);



  const [addressInfo, setAddressInfo] = useState<any>(null);
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cpfValid, setCpfValid] = useState<boolean | null>(null);
  const [cpfInput, setCpfInput] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const saveContactsToLocalStorage = (updatedContacts: Contact[]) => {
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  };

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
        }
      } catch (error) {
        console.error('Erro ao consultar o CEP:', error);
        setAddressInfo(null);
      }
    } else {
      setAddressInfo(null);
    }
  };

  const handleEditContact = async (id: number) => {
    setEditingContactId(id);
    const contactToEdit = contacts.find((contact) => contact.id === id);
    if (contactToEdit) {
      setNome(contactToEdit.nome);
      setCpfValue(contactToEdit.cpf);
      setTelefone(contactToEdit.telefone);
      setEndereco(contactToEdit.endereco);
      setCep(contactToEdit.cep);
      setUf(contactToEdit.uf);
      setLocalidade(contactToEdit.localidade);

      try {
        // Obter latitude e longitude do endereço do contato
        const { latitude, longitude } = await getLatLngFromAddress(`${contactToEdit.endereco}, ${contactToEdit.localidade}, ${contactToEdit.uf}`);
        setLatitude(latitude);
        setLongitude(longitude);
      } catch (error) {
        console.error('Erro ao obter as coordenadas de geolocalização:', error);
        // Trate o erro, se necessário
      }
    }
  };


  const handleSaveEditContact = () => {
    if (nome
      && cpfValue
      && (cpfValidator.isValid(cpfValue))
    ) {
      const updatedContacts = contacts.map((contact) => {

        if (contact.id === editingContactId) {
          return {
            ...contact,
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
        }
        return contact;
      });
      setContacts(updatedContacts);
      saveContactsToLocalStorage(updatedContacts);
      setEditingContactId(null);
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


  const handleDeleteContact = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    saveContactsToLocalStorage(updatedContacts);
  };




  const handleGetGolocation = async (id: number) => {
    setEditingContactId(id);

    const contactToGeo = contacts.find((contact) => contact.id === id);
    if (contactToGeo) {
      //setEndereco(contactToGeo.endereco);
      //setLocalidade(contactToGeo.localidade);
      //alert(contactToGeo.endereco)
      try {
        const { latitude, longitude } = await getLatLngFromAddress(contactToGeo.endereco);
        setLatitudeGeo(latitude);
        setLongitudeGeo(longitude);
        console.log(latitude, longitude)
      } catch (error) {
        console.error('Erro ao obter a geolocalização:', error);
        // Trate o erro, se desejar
      }
    }
  };


  
  return (
    <div>
      <h1>Contatos</h1>

      <TextField
        label="Pesquisar por CPF ou Nome"
        size="small"
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
            <TableCell>Estado</TableCell>
            <TableCell>Cidade</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                ) : (
                  contact.nome
                )}
              </TableCell>
              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={cpfValue}
                    onChange={(e) => {
                      setCpfInput(e.target.value);
                      validateAndSetCpf(e.target.value);
                    }}
                    error={cpfValue !== '' && !cpfValid}
                    helperText={cpfValue !== '' && !cpfValid ? "CPF inválido" : ""}
                  />
                ) : (
                  contact.cpf
                )}

              </TableCell>
              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                ) : (
                  contact.telefone
                )}
              </TableCell>
              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                  />
                ) : (
                  contact.endereco
                )}
              </TableCell>
              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                  />
                ) : (
                  contact.cep
                )}
              </TableCell>

              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={uf}
                    onChange={(e) => handleCepChange(e.target.value)}
                  />
                ) : (
                  contact.uf
                )}
              </TableCell>

              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={localidade}
                    onChange={(e) => handleCepChange(e.target.value)}
                  />
                ) : (
                  contact.localidade
                )}
              </TableCell>

              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  />
                ) : (
                  contact.latitude
                )}
              </TableCell>

              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <TextField
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  />
                ) : (
                  contact.longitude
                )}
              </TableCell>

              <TableCell>
                {editingContactId === contact.id && !latitudeGeo ? (
                  <IconButton onClick={handleSaveEditContact}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => handleEditContact(contact.id)}>
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => handleDeleteContact(contact.id)}>
                  <DeleteIcon />
                </IconButton>

                <LocationOnIcon onClick={() => handleGetGolocation(contact.id)}>
                  <DeleteIcon />
                </LocationOnIcon>


              </TableCell>
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

      <div>
        <Typography variant="h6">Geolocalização</Typography>
        <Typography variant="body1">Latitude: {latitudeGeo}</Typography>
        <Typography variant="body1">Longitude: {longitudeGeo}</Typography>
      </div>

      {latitudeGeo ? (
        <div>
          <h1>Meu Mapa</h1>
          <MapWithMarker latitude={latitudeGeo} longitude={longitudeGeo} text={'fer'} />
        </div>
      ) : (
        <h1>sem coordenadas</h1>
      )}

      <div>
      </div>

    </div>
  );
};

export default ListContacts;
