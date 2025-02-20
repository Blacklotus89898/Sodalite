interface ContainerProps {
    children: {
        link: string;
        name: string;
    };
}

export const Iframe: React.FC<ContainerProps> = ({ children: { link, name } }) => {
    return <iframe className="container" src={link} title={name} style={{ border: '1px solid white', borderRadius: '15px' }}>{name}</iframe>;
};
