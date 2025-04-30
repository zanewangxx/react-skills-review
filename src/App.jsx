import { useState } from 'react';
import Filter from './components/Filter.jsx'
import PersonsForm from './components/PersonsForm.jsx'
import Persons from './components/Persons.jsx'

const App = () =>{
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas', number: '040-1234567'},
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523'},
    { id: 3, name: 'Dan Abramov', number: '12-43-234345'},
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122'}
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already in the phonebook`)
      return
    }
    if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} is already in the phonebook`)
      return
    }
    setPersons(persons.concat({
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }))
    setNewName('')
    setNewNumber('')
  }
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
      <Persons persons={personsToShow} />
    </>
  )
}

export default App