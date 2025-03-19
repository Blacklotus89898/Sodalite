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
  },
  {
    id: 3,
    name: 'Alice Johnson',
    phone: '555-123-4567',
    email: 'alice@example.com',
    address: '789 Pine Rd',
    notes: 'Neighbor',
    socialLinks: [{ platform: 'Facebook', url: 'https://facebook.com/alicejohnson' }],
  },
];

const ContactBook: React.FC = () => {
  const [contacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSocialClick = (platform: string, url: string) => {
    console.log(`Clicked on ${platform}: ${url}`);
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto', padding: '10px' }}>
        <h2>Contacts</h2>
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
            <p><strong>Phone:</strong> {selectedContact.phone}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Address:</strong> {selectedContact.address}</p>
            <p><strong>Notes:</strong> {selectedContact.notes}</p>
            <h3>Social Links</h3>
            <ul>
              {selectedContact.socialLinks?.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(link.platform, link.url);
                    }}
                  >
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
            <SocialGraph socialLinks={selectedContact.socialLinks || []} />
          </div>
        ) : (
          <p>Select a contact to see the details</p>
        )}
      </div>
    </div>
  );
};

interface SocialLink {
    platform: string;
    url: string;
  }

const SocialGraph: React.FC<{ socialLinks: SocialLink[] }> = ({ socialLinks }) => {
    const centerX = 200; // Center X position
    const centerY = 200; // Center Y position
    const radius = 100; // Radius of the circular arrangement
  
    return (
      <div style={{ position: 'relative', width: '400px', height: '400px', margin: '20px auto', border: '1px solid #ccc' }}>
        {/* SVG for Lines */}
        <svg
          width="400"
          height="400"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0, // Ensure lines render below nodes
          }}
        >
          {socialLinks.map((_, index) => {
            const angle = (index * 2 * Math.PI) / socialLinks.length;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
  
            return (
              <line
                key={`line-${index}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#ccc"
                strokeWidth="2"
              />
            );
          })}
        </svg>
  
        {/* Nodes */}
        {socialLinks.map((link, index) => {
          const angle = (index * 2 * Math.PI) / socialLinks.length;
          const x = centerX + radius * Math.cos(angle) - 40; // Center each node horizontally
          const y = centerY + radius * Math.sin(angle) - 15; // Center each node vertically
  
          return (
            <div
              key={link.platform}
              style={{
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`,
                width: '80px',
                height: '30px',
                textAlign: 'center',
                lineHeight: '30px',
                background: '#ddd',
                borderRadius: '15px',
                cursor: 'pointer',
                zIndex: 1, // Ensure nodes render above lines
              }}
              onClick={() => window.open(link.url, '_blank')}
            >
              {link.platform}
            </div>
          );
        })}
  
        {/* Center Node */}
        <div
          style={{
            position: 'absolute',
            top: `${centerY - 25}px`,
            left: `${centerX - 25}px`,
            width: '50px',
            height: '50px',
            background: '#007bff',
            borderRadius: '50%',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '50px',
            fontWeight: 'bold',
          }}
        >
          You
        </div>
      </div>
    );
  };

export default ContactBook;