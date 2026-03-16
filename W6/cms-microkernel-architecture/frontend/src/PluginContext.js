import React, { createContext, useState, useContext } from 'react';

const PluginContext = createContext();

export { PluginContext };

export const PluginProvider = ({ children }) => {
    const [registry, setRegistry] = useState({});

    // Hàm này cho phép Plugin bên ngoài gọi để đăng ký UI
    const registerUI = (slotName, Component) => {
        setRegistry(prev => ({ ...prev, [slotName]: [...(prev[slotName] || []), Component] }));
    };

    return (
        <PluginContext.Provider value={{ registry, registerUI }}>
            {children}
        </PluginContext.Provider>
    );
};

export const usePlugin = () => useContext(PluginContext);

export const Slot = ({ name, data }) => {
    const { registry } = useContext(PluginContext);
    const Components = registry[name] || [];
    return <>{Components.map((Comp, i) => <Comp key={i} data={data} />)}</>;
};