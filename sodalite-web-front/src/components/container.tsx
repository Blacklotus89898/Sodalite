
interface ContainerProps {
    children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
    return <div className="container" style={{ border: '1px solid white',  borderRadius:'15px' }}>{children}</div>;
};
