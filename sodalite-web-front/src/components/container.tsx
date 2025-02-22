
interface ContainerProps {
    children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    return <div className="container" style={{ border: '1px solid blue', borderRadius: '15px', padding: "20px" }}>{children}</div>;
};
