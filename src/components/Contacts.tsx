import React, { useState } from 'react';
import {
  TextField,
  Button,
} from '@mui/material';

interface Contact {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
  cep: string;
  estado: string;
  cidade: string;
  latitude: number;
  longitude: number;
}

const Contacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const handleCepChange = async (value: string) => {
    setCep(value);
    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setEndereco(data.logradouro);
          setEstado(data.uf);
          setCidade(data.localidade);
          setLatitude(parseFloat(data.latitude));
          setLongitude(parseFloat(data.longitude));
        }
      } catch (error) {
        console.error('Erro ao consultar o CEP:', error);
      }
    }
  };

  const handleAddContact = () => {
    const newContact: Contact = {
      id: contacts.length + 1,
      nome,
      cpf,
      telefone,
      endereco,
      cep,
      estado,
      cidade,
      latitude,
      longitude,
    };
    setContacts([...contacts, newContact]);
    // Limpar os campos após adicionar o contato
    setNome('');
    setCpf('');
    setTelefone('');
    setEndereco('');
    setCep('');
    setEstado('');
    setCidade('');
    setLatitude(0);
    setLongitude(0);
  };

  const handleDeleteContact = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
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
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
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
        label="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Estado"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TextField
        label="Cidade"
        value={cidade}
        onChange={(e) => setCidade(e.target.value)}
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
      <Button variant="contained" color="primary" onClick={handleAddContact}>
        Adicionar Contato
      </Button>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <div>Nome: {contact.nome}</div>
            <div>CPF: {contact.cpf}</div>
            <div>Telefone: {contact.telefone}</div>
            <div>Endereço: {contact.endereco}</div>
            <div>CEP: {contact.cep}</div>
            <div>Estado: {contact.estado}</div>
            <div>Cidade: {contact.cidade}</div>
            <div>Latitude: {contact.latitude}</div>
            <div>Longitude: {contact.longitude}</div>
            <button onClick={() => handleDeleteContact(contact.id)}>Deletar Contato</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts;
