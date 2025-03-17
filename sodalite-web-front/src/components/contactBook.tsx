import React, { useState } from 'react';

// Define the contact interface
interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
}

// Sample contacts
const initialContacts: Contact[] = [
  { id: 1, name: 'John Doe', phone: '123-456-7890', email: 'john@example.com', address: '123 Elm St', notes: 'Friend from college' },
  { id: 2, name: 'Jane Smith', phone: '987-654-3210', email: 'jane@example.com', address: '456 Oak Ave', notes: 'Work colleague' },
  { id: 3, name: 'Alice Johnson', phone: '555-123-4567', email: 'alice@example.com', address: '789 Pine Rd', notes: 'Neighbor' },
];

const ContactBook: React.FC = () => {
  const [contacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Filter contacts based on the search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
//   Add a graph view on top with logos of social media platforms + onclick triggers the api calls
// create social network from this

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto', padding: '10px' }}>
        <h2>Contacts</h2>
        {/* Search field */}
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredContacts.map((contact) => (
            <li
              key={contact.id}
              style={{
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: selectedContact?.id === contact.id ? '#f0f0f0' : 'transparent',
              }}
              onClick={() => setSelectedContact(contact)}
            >
              {contact.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Details View */}
      <div style={{ flex: 1, padding: '10px' }}>
        {selectedContact ? (
          <div>
            <h2>{selectedContact.name}</h2>
            <p><strong>Phone:</strong> {selectedContact.phone}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Address:</strong> {selectedContact.address}</p>
            <p><strong>Notes:</strong> {selectedContact.notes}</p>
          </div>
        ) : (
          <p>Select a contact to see the details</p>
        )}
      </div>
    </div>
  );
};

export default ContactBook;
