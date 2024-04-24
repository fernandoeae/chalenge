import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SaveIcon from '@mui/icons-material/Save';
import { cpf } from 'cpf-cnpj-validator';// Importa a função isValid do pacote cpf-validar

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
  const [cpfInput, setCpfInput] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [addressInfo, setAddressInfo] = useState<any>(null);
  const [localidade, setLocalidade] = useState('');
  const [uf, setUf] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const saveContactsToLocalStorage = (updatedContacts: Contact[]) => {
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  };

  const filteredContacts = contacts.filter((contact) => {
    return contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.cpf.includes(searchTerm);
  });

  const isValidCPF = (inputCPF: string) => {
    return cpf.isValid(inputCPF);
  };

  const handleCepChange = async (value: string) => {
    setCep(value);
    if (value.length === 8) { // Verifica se o CEP tem o tamanho correto
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
      setCpfInput(contactToEdit.cpf);
      setTelefone(contactToEdit.telefone);
      setEndereco(contactToEdit.endereco);
      setCep(contactToEdit.cep);
      setLatitude(contactToEdit.latitude);
      setLongitude(contactToEdit.longitude);
      setAddressInfo(null);
    }
  };

  const handleSaveEditContact = () => {
    if (!isValidCPF(cpfInput)) { // Verifica se o CPF é válido antes de salvar
      alert('CPF inválido');
      return;
    }

    const updatedContacts = contacts.map((contact) => {
      if (contact.id === editingContactId) {
        return {
          ...contact,
          nome,
          cpf: cpfInput,
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
    // Limpar os campos após editar o contato
    setNome('');
    setCpfInput('');
    setTelefone('');
    setEndereco('');
    setCep('');
    setLatitude(0);
    setLongitude(0);
  };

  const handleAddContact = () => {
    if (!isValidCPF(cpfInput)) { // Verifica se o CPF é válido antes de salvar
      alert('CPF inválido');
      return;
    }

    const newContact: Contact = {
      id: contacts.length + 1,
      nome,
      cpf: cpfInput,
      localidade, // Cidade
      uf, // Estado
      telefone,
      endereco,
      cep,
      latitude,
      longitude,
    };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveContactsToLocalStorage(updatedContacts);
    // Limpar os campos após adicionar o contato
    setNome('');
    setCpfInput('');
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
        value={cpfInput}
        onChange={(e) => setCpfInput(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
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
          {contacts.map((contact) => (
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
    </div>
  );
};

export default ListContacts;
