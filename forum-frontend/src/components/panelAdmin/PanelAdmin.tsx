import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import req from '../../helpers/request';
import { ThemeContext } from '../../store/StoreProvider';
import ModalUser from '../modalUser/ModalUser';

interface OptionalUserI {
    id: string;
    message: string;
    dateFinish: Date
}

interface UserAdminI {
    id: string;
    login: string;
    image: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: Date;
    optionalUser: OptionalUserI;
}

const PanelAdmin: React.FC = (): JSX.Element => {
    const [users, setUsers] = useState<UserAdminI[]>([]);
    const [showModalUser, setShowModalUser] = useState<boolean>(false);
    const [userSettings, setUserSettings] = useState<UserAdminI | null>(null);

    const [deleteAvatar, setDeleteAvatar] = useState<boolean>(false);
    const [currentRole, setCurrentRole] = useState<string>('');
    const [timeBan, setTimeBan] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [reasonBan, setReasonBan] = useState<string>('');

    const { theme } = useContext(ThemeContext);

    const handleOnCheckDeleteAvatar = (event: ChangeEvent<HTMLInputElement>): void => setDeleteAvatar(event.target.checked);
    const handleChangeRole = (event: ChangeEvent<HTMLSelectElement>): void => setCurrentRole(event.target.value);
    const handleSetBan = (event: ChangeEvent<HTMLInputElement>): void => {
        setTimeBan(event.target.value);
        setIsActive(false);
    };
    const handleSetReasonBan = (event: ChangeEvent<HTMLInputElement>): void => setReasonBan(event.target.value);


    const handleDeleteAccount = async (): Promise<void> => {
        try {
            const data = await req.delete(`user/delete/${userSettings?.id}`);
            if(data?.data?.message === 'Konto zostało usunięte') {
                setShowModalUser(false);
            }
        } catch {}               
    }

    const validateInputs = () => {
        let validateValue = true;
        if(!isActive) {
            const ban = Boolean(timeBan) && Boolean(reasonBan);
            const value: boolean = ban ? validateValue : !validateValue;
        }
        return validateValue;
    }

    const handleSubmitChanges = async (): Promise<void> => {
        if(validateInputs()) {
            const data = await req.patch(`user/admin-update`, {
                id: userSettings?.id,
                login: userSettings?.login,
                role: currentRole,
                active: isActive,
                image: deleteAvatar,
                dateFinish: timeBan,
                reasonBan: reasonBan
            });
            if(data?.data?.message === "Pomyślnie zaaktualizowano użytkownika") {
                setShowModalUser(false);
            }
        }
    }

    useEffect(() => {
        const fetchUsers = async (): Promise<void> => {
            const data = await req.get('user/all');
            try {
                setUsers(data.data);
            } catch {}
        };
        fetchUsers();
    }, [showModalUser]);

    const handleShowModalUser = (user: UserAdminI) => {
        setUserSettings(user);
        setShowModalUser(true);
    } 
    const closeModal = () => setShowModalUser(false);
    
    return (
        <>                            
            <Table responsive striped bordered hover variant={theme.tableColor}>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Login</th>
                    <th>Avatar</th>
                    <th>Email</th>
                    <th>Rola</th>
                    <th>Aktywny</th>
                    <th>Ban</th>
                    <th>Utworzone</th>
                    </tr>
                </thead>
                <tbody style={{cursor: 'pointer'}}>
                    {
                    users.map((user: UserAdminI, index: number) => {
                        return (
                        <tr
                            key={index}
                            onClick={() => handleShowModalUser(user)}
                        >                            
                            <td>{index+1}</td>
                            <td>{user?.login}</td>
                            <td>{user?.image}</td>
                            <td>{user?.email}</td>
                            <td>{user?.role}</td>
                            <td>{user?.active ? 'tak' : 'nie'}</td>
                            <td>{user?.optionalUser?.dateFinish}</td>
                            <td>{user?.createdAt}</td>
                        </tr>
                        )                        
                    })
                }
                </tbody>
            </Table>
            <ModalUser show={showModalUser} onHide={closeModal} handleOnCheckDeleteAvatar={handleOnCheckDeleteAvatar} handleChangeRole={handleChangeRole} handleSetBan={handleSetBan} currentRole={currentRole} timeBan={timeBan} userName={userSettings?.login} handleSubmitChanges={handleSubmitChanges} handleDeleteAccount={handleDeleteAccount} handleSetReasonBan={handleSetReasonBan} reasonBan={reasonBan}/>           
        </>
    )
}

export default PanelAdmin;