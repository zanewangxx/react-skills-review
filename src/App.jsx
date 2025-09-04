import { useState, useEffect } from 'react';
import Filter from './components/Filter.jsx'
import PersonsForm from './components/PersonsForm.jsx'
import Persons from './components/Persons.jsx'
import personsService from './service/persons.jsx'

const App = () =>{
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, []);
  
  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already in the phonebook, replace the old number with a new one?`
      )
      if (!confirmUpdate) return;
      return updatePerson(existingPerson.id, { ...existingPerson, number: newNumber });
    }
    if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} is already in the phonebook`);
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber
    };
    personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        alert(error?.response?.data?.error || 'Failed to add person');
      });
  };

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          const status = error?.response?.status
          if (status === 404) {
            alert(`the person '${name}' was already deleted from server`)
            setPersons(persons.filter(p => p.id !== id))
          } else {
            alert(error?.response?.data?.error || `Failed to delete '${name}'`)
          }
        })
    }
  }

  const updatePerson = (id, updatedPerson) => {
    personsService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        const status = error?.response?.status
        if (status === 404) {
          alert(`the person '${updatedPerson.name}' was already deleted from server`)
          setPersons(persons.filter(p => p.id !== id))
        } else {
          // Show backend validation or other error message
          alert(error?.response?.data?.error || `Failed to update '${updatedPerson.name}'`)
        }
      });
  };
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <h1>Phonebook</h1>
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonsForm newName={newName} newNumber={newNumber} setNewName={setNewName} setNewNumber={setNewNumber} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </>
  )
}

export default App
