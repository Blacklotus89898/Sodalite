import React, { useState } from 'react';

// Define the contact interface
interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  socialLinks?: { platform: string; url: string }[];
  extraFields?: { key: string; value: string }[];
}

const initialContacts: Contact[] = [
  {
    id: 1,
    name: 'John Doe',
    phone: '123-456-7890',
    email: 'john@example.com',
    address: '123 Elm St',
    notes: 'Friend from college',
    socialLinks: [
      { platform: 'Facebook', url: 'https://facebook.com/johndoe' },
      { platform: 'Twitter', url: 'https://twitter.com/johndoe' },
    ],
    extraFields: [],
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '987-654-3210',
    email: 'jane@example.com',
    address: '456 Oak Ave',
    notes: 'Work colleague',
    socialLinks: [
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/janesmith' },
      { platform: 'Instagram', url: 'https://instagram.com/janesmith' },
    ],
    extraFields: [],
  },
];

const ContactBook: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const addContact = () => {
    const newContact: Contact = {
      id: Date.now(),
      name: 'New Contact',
      phone: '',
      email: '',
      address: '',
      notes: '',
      socialLinks: [],
      extraFields: [],
    };
    setContacts([...contacts, newContact]);
  };

  const updateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(contact => contact.id === updatedContact.id ? updatedContact : contact));
    setSelectedContact(updatedContact);
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    setSelectedContact(null);
  };

  const addField = () => {
    if (selectedContact) {
      const updatedContact = { ...selectedContact, extraFields: [...(selectedContact.extraFields || []), { key: '', value: '' }] };
      updateContact(updatedContact);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto', padding: '10px' }}>
        <h2>Contacts</h2>
        <button onClick={addContact}>Add Contact</button>
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
      <div style={{ flex: 1, padding: '10px' }}>
        {selectedContact ? (
          <div>
            <h2>{selectedContact.name}</h2>
            <p><strong>Phone:</strong> <input type="text" value={selectedContact.phone} onChange={(e) => updateContact({...selectedContact, phone: e.target.value})} /></p>
            <p><strong>Email:</strong> <input type="text" value={selectedContact.email} onChange={(e) => updateContact({...selectedContact, email: e.target.value})} /></p>
            <p><strong>Address:</strong> <input type="text" value={selectedContact.address} onChange={(e) => updateContact({...selectedContact, address: e.target.value})} /></p>
            <p><strong>Notes:</strong> <input type="text" value={selectedContact.notes} onChange={(e) => updateContact({...selectedContact, notes: e.target.value})} /></p>
            <h3>Extra Fields</h3>
            {selectedContact.extraFields?.map((field, index) => (
              <div key={index}>
                <input type="text" value={field.key} placeholder="Field Name" onChange={(e) => {
                  const updatedFields = [...selectedContact.extraFields!];
                  updatedFields[index].key = e.target.value;
                  updateContact({ ...selectedContact, extraFields: updatedFields });
                }} />
                <input type="text" value={field.value} placeholder="Field Value" onChange={(e) => {
                  const updatedFields = [...selectedContact.extraFields!];
                  updatedFields[index].value = e.target.value;
                  updateContact({ ...selectedContact, extraFields: updatedFields });
                }} />
              </div>
            ))}
            <button onClick={addField}>Add Field</button>
            <button onClick={() => deleteContact(selectedContact.id)}>Delete Contact</button>
            <SocialGraph socialLinks={selectedContact.socialLinks || []} />
          </div>
        ) : (
          <p>Select a contact to see the details</p>
        )}
      </div>
    </div>
  );
};

export default ContactBook;


const SocialGraph: React.FC<{ socialLinks: { platform: string; url: string }[] }> = ({ socialLinks }) => {
  const centerX = 200;
  const centerY = 200;
  const radius = 100;

  return (
    <div style={{ position: 'relative', width: '400px', height: '400px', margin: '20px auto', border: '1px solid #ccc' }}>
      <svg width="400" height="400" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        {socialLinks.map((_, index) => {
          const angle = (index * 2 * Math.PI) / socialLinks.length;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return <line key={`line-${index}`} x1={centerX} y1={centerY} x2={x} y2={y} stroke="#ccc" strokeWidth="2" />;
        })}
      </svg>
      {socialLinks.map((link, index) => {
        const angle = (index * 2 * Math.PI) / socialLinks.length;
        const x = centerX + radius * Math.cos(angle) - 40;
        const y = centerY + radius * Math.sin(angle) - 15;

        return (
          <div key={link.platform} style={{ position: 'absolute', top: `${y}px`, left: `${x}px`, width: '80px', height: '30px', textAlign: 'center', lineHeight: '30px', background: '#ddd', borderRadius: '15px', cursor: 'pointer', zIndex: 1 }} onClick={() => window.open(link.url, '_blank')}>
            {link.platform}
          </div>
        );
      })}
      <div style={{ position: 'absolute', top: `${centerY - 25}px`, left: `${centerX - 25}px`, width: '50px', height: '50px', background: '#007bff', borderRadius: '50%', color: '#fff', textAlign: 'center', lineHeight: '50px', fontWeight: 'bold' }}>
        You
      </div>
    </div>
  );
};

