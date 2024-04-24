import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Typography,
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
  const [addressInfo, setAddressInfo] = useState<any>(null);
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cpfValid, setCpfValid] = useState<boolean | null>(null);
  const [cpfInput, setCpfInput] = useState('');

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
    setCpfValue(value);
    setCpfValid(isValid);
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
          setLatitude(parseFloat(data.latitude));
          setLongitude(parseFloat(data.longitude));
        }
      } catch (error) {
        console.error('Erro ao consultar o CEP:', error);
        setAddressInfo(null);
      }
    } else {
      setAddressInfo(null);
    }
  };

  const handleEditContact = (id: number) => {
    setEditingContactId(id);
    const contactToEdit = contacts.find((contact) => contact.id === id);
    if (contactToEdit) {
      setNome(contactToEdit.nome);
      setCpfValue(contactToEdit.cpf);
      setTelefone(contactToEdit.telefone);
      setEndereco(contactToEdit.endereco);
      setCep(contactToEdit.cep);
      setLatitude(contactToEdit.latitude);
      setLongitude(contactToEdit.longitude);
      setAddressInfo(null);
    }
  };

  const handleSaveEditContact = () => {
    const updatedContacts = contacts.map((contact) => {
      if (contact.id === editingContactId) {
        return {
          ...contact,
          nome,
          cpf: cpfValue,
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
    setTelefone('');
    setEndereco('');
    setCep('');
    setLatitude(0);
    setLongitude(0);
  };

  const handleAddContact = () => {
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
  };

  const handleDeleteContact = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    saveContactsToLocalStorage(updatedContacts);
  };

  return (
    <div>
      <h1>Contatos</h1>
      <TextField
        label="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="CPF"
        value={cpfValue}
        onChange={(e) => validateAndSetCpf(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
        error={cpfValue !== '' && !cpfValid}
        helperText={cpfValue !== '' && !cpfValid ? "CPF inválido" : ""}
      />
      <TextField
        label="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="CEP"
        value={cep}
        onChange={(e) => handleCepChange(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Estado"
        value={uf}
        variant="outlined"
        fullWidth
        margin="normal"
        disabled
      />
      <TextField
        label="Cidade"
        value={localidade}
        variant="outlined"
        fullWidth
        margin="normal"
        disabled
      />

      <TextField
        label="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Latitude"
        type="number"
        value={latitude}
        onChange={(e) => setLatitude(parseFloat(e.target.value))}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Longitude"
        type="number"
        value={longitude}
        onChange={(e) => setLongitude(parseFloat(e.target.value))}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      {editingContactId ? (
        <Button variant="contained" color="primary" onClick={handleSaveEditContact}>
          Salvar Edição
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleAddContact}>
          Adicionar Contato
        </Button>
      )}

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
            <TableCell>Actions</TableCell>
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
                    onChange={(e) => setCpfInput(e.target.value)}
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
              <TableCell>
                {editingContactId === contact.id ? (
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {cpfValue !== '' && cpfValid !== null && (
        <Typography variant="body2" color={cpfValid ? "textPrimary" : "error"}>
          {cpfValid ? "CPF válido" : "CPF inválido"}
        </Typography>
      )}

    </div>
  );
};

export default ListContacts;
