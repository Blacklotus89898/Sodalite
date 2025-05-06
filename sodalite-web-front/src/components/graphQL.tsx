import React, { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, useLazyQuery, gql } from "@apollo/client";

const GraphQLContent: React.FC = () => {
  const [resource, setResource] = useState("message"); // Default resource
  const [query, setQuery] = useState(gql`
    query {
      message
    }
  `);

  // Lazy query to fetch data on button click
  const [fetchData, { loading, error, data }] = useLazyQuery(query);

  const handleQueryChange = () => {
    // Dynamically update the query based on the resource
    setQuery(
      gql`
        query {
          ${resource}
        }
      `
    );
  };

  const handleFetch = () => {
    handleQueryChange(); // Update the query
    fetchData(); // Execute the query
  };

  return (
    <div>
      <h1>GraphQL Query Tester</h1>
      <p>
      Availble resources: message, hello
      </p>
      <input
        type="text"
        value={resource}
        onChange={(e) => setResource(e.target.value)}
        placeholder="Enter resource name (e.g., message)"
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={handleFetch} style={{ padding: "5px 10px" }}>
        Query
      </button>
      <div style={{ marginTop: "20px" }}>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
};

const GraphQL: React.FC = () => {
  const client = new ApolloClient({
    uri: "http://127.0.0.1:8081/graphql", // Replace with your GraphQL endpoint
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <GraphQLContent />
    </ApolloProvider>
  );
};

export default GraphQL;