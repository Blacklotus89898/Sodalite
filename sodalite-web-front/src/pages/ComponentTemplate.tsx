import React from "react";

// Define the type for the props
interface MyComponentProps {
  title: string;
  description: string;
  count: number;
  onClick: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description, count, onClick }) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>Count: {count}</p>
      <button onClick={onClick}>Click me</button>
    </div>
  );
};

export default MyComponent;
