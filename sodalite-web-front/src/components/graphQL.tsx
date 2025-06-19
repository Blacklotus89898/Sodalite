import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useLazyQuery,
  useMutation,
  gql,
} from "@apollo/client";

// Queries
const HELLO_QUERY = gql`query { hello }`;
const MESSAGE_QUERY = gql`query { message }`;
const ALL_MESSAGES_QUERY = gql`query { allMessages { id content } }`;

// Mutations
const ADD_MESSAGE_MUTATION = gql`
  mutation AddMessage($content: String!) {
    addMessage(content: $content) {
      id
      content
    }
  }
`;

const CLEAR_MESSAGES_MUTATION = gql`
  mutation {
    clearMessages
  }
`;

const GraphQLContent: React.FC = () => {
  const [resource, setResource] = useState("message");
  const [messageContent, setMessageContent] = useState("");

  // Lazy queries
  const [fetchHello, helloResult] = useLazyQuery(HELLO_QUERY);
  const [fetchMessage, messageResult] = useLazyQuery(MESSAGE_QUERY);
  const [fetchAllMessages, allMessagesResult] = useLazyQuery(ALL_MESSAGES_QUERY);

  // Mutations
  const [addMessage] = useMutation(ADD_MESSAGE_MUTATION, {
    refetchQueries: [{ query: ALL_MESSAGES_QUERY }],
  });
  const [clearMessages] = useMutation(CLEAR_MESSAGES_MUTATION, {
    refetchQueries: [{ query: ALL_MESSAGES_QUERY }],
  });

  const handleFetch = () => {
    switch (resource.toLowerCase()) {
      case "hello":
        fetchHello();
        break;
      case "message":
        fetchMessage();
        break;
      case "allmessages":
        fetchAllMessages();
        break;
      default:
        alert("Unknown resource. Try: hello, message, allMessages");
    }
  };

  const handleAddMessage = () => {
    if (!messageContent.trim()) return;
    addMessage({ variables: { content: messageContent } });
    setMessageContent("");
  };

  const handleClearMessages = () => {
    clearMessages();
  };

  const data =
    helloResult.data?.hello ||
    messageResult.data?.message ||
    allMessagesResult.data?.allMessages;

  const isLoading =
    helloResult.loading || messageResult.loading || allMessagesResult.loading;

  const error =
    helloResult.error || messageResult.error || allMessagesResult.error;

  return (
    <div>
      <h1>GraphQL Query Tester</h1>
      <p>Available resources: <code>hello</code>, <code>message</code>, <code>allMessages</code></p>
      
      <input
        type="text"
        value={resource}
        onChange={(e) => setResource(e.target.value)}
        placeholder="Enter resource name"
        style={{ marginRight: "10px", padding: "5px" }}
      />
      <button onClick={handleFetch} style={{ padding: "5px 10px", marginRight: "10px" }}>
        Query
      </button>

      <div style={{ margin: "20px 0" }}>
        <input
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="Add a message"
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button onClick={handleAddMessage} style={{ padding: "5px 10px", marginRight: "10px" }}>
          Add Message
        </button>
        <button onClick={handleClearMessages} style={{ padding: "5px 10px" }}>
          Clear Messages
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>

  {isLoading && <p>Loading...</p>}
  {error && <p>Error: {error.message}</p>}

  {/* Render based on query result */}
  {helloResult.data && <pre>{JSON.stringify(helloResult.data.hello, null, 2)}</pre>}
  {messageResult.data && <pre>{JSON.stringify(messageResult.data.message, null, 2)}</pre>}
  {allMessagesResult.data && (
    <pre>{JSON.stringify(allMessagesResult.data.allMessages, null, 2)}</pre>
  )}
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
