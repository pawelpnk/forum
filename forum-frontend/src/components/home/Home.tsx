import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import req from '../../helpers/request';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { ChatRightText } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import { UserContext } from '../../store/StoreProvider';
import ModalSection from '../modalSection/ModalSection';
import ModalInfo from '../modal/ModalInfo';
import ModalConfirm from '../modalConfirm/modalConfirm';

export interface SectionType {
    id: string;
    sectionName: string;
}

const Home: React.FC = (): JSX.Element => {

    const [section, setSection] = useState<SectionType[]>([]);
    const [newSectionName, setNewSectionName] = useState<string>('');
    const [showModalSection, setShowModalSection] = useState<boolean>(false);
    const [showModalInfo, setShowModalInfo] = useState<boolean>(false);
    const [text, setText] = useState<string>('');

    const [showModalSectionUpdate, setShowModalSectionUpdate] = useState<boolean>(false);
    const [sectionId, setSectionId] = useState<string>('');

    const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const sectionData = async (): Promise<void> => {
        const data = await req.get('section');
        setSection(data.data);
    }

    useEffect(() => {
        sectionData();
    },[showModalInfo]);

    const handleRedirectToTopics = (sec: SectionType) => {
        localStorage.setItem('currentSection', JSON.stringify(sec));
        navigate(`/s/${sec.id}`)
    }

    const handleAddSectionButton = () => {
        setShowModalSection(true);
    }

    const cleanModalSection = () => {
        setShowModalSection(false);
        setShowModalSectionUpdate(false);
        setNewSectionName('');
    }

    const handleNewSection = (e: ChangeEvent<HTMLInputElement>) => setNewSectionName(e.target.value);

    const handleCloseModalSection = () => {
        cleanModalSection();
        setText('');
        setSectionId('');
    }
    
    const handleAddSectionPost = async (): Promise<void> => {
        cleanModalSection();
        setShowModalInfo(true);
        const result = await req.post('section/add', {
            sectionName: newSectionName
        });
        setText(result.data.message);
    }

    const handleCloseModalInfo = () => {
        setText('');
        setNewSectionName('');
        setSectionId('');
        setShowModalInfo(false);
    }

    const userLogged: string | null = user ? user.role : null;

    const handleEditSection = (id: string) => {
        setSectionId(id);
        setShowModalSectionUpdate(true);
    }

    const handleDeleteSection = (id: string) => {
        setSectionId(id);
        setTitle('Czy na pewno chcesz usunąć tę sekcję? Spowoduje to usunięcie wszystkich jej tematów wraz z postami');
        setShowModalConfirm(true);
    }

    const handleUpdateSectionPatch = async (): Promise<void> => {
        cleanModalSection();
        const result = await req.patch(`section/update/${sectionId}`, {
            sectionName: newSectionName
        });
        setShowModalInfo(true);
        setText(result.data.message);
    }

    const handleCloseModalConfirm = () => {
        setShowModalConfirm(false);
        setSectionId('');
    }

    const handleConfirmDeleteSection = async (): Promise<void> => {
        setShowModalConfirm(false);
        const result = await req.delete(`section/delete/${sectionId}`);
        setShowModalInfo(true);
        setText(result.data.message);
    }

    return (        
        <Container className='my-5 text-light'>
            <p className='text-secondary mb-5'>Witaj na forum, gdzie możesz porozmawiać na każdy temat. Wystarczy, że odszukasz odpowiedni dział,
                a następnie temat lub założysz swój własny! Zapraszamy również do odwiedzenia Komunikatora, gdzie
                można porozmawiać z wybranymi osobami, a także zajrzeć do zakładki "Nuda" :)
            </p>
            {userLogged === 'admin' ? <Button className='mb-2' variant='outline-light' onClick={handleAddSectionButton}>Dodaj nową sekcje</Button> : null}
            {   
                section.map((sec: any) => {
                    return (
                        <Row key={sec.id} className='border py-3'>
                            <Col sm={1} className='px-4 d-flex justify-content-center align-items-center'>
                                <ChatRightText />
                            </Col>
                            <Col sm={5}>
                                <Nav.Link onClick={() => handleRedirectToTopics(sec)}>{sec.sectionName}</Nav.Link>
                            </Col>
                            <Col className='d-flex justify-content-end'>
                                {userLogged === 'admin' ? <Button variant='outline-warning' className='mx-2' onClick={() => handleEditSection(sec.id)}>Edytuj</Button> : null}
                                {userLogged === 'admin' ? <Button variant='outline-danger' onClick={() => handleDeleteSection(sec.id)}>Usuń</Button> : null}
                            </Col>
                        </Row>
                    )
                })
            }
            <ModalSection show={showModalSection} onHide={handleCloseModalSection} handleNewSection={handleNewSection} newSectionName={newSectionName} handleAddSectionPost={handleAddSectionPost}/>
            <ModalInfo show={showModalInfo} onHide={handleCloseModalInfo} text={text}/>
            <ModalSection show={showModalSectionUpdate} onHide={handleCloseModalSection} handleNewSection={handleNewSection} newSectionName={newSectionName} handleAddSectionPost={handleUpdateSectionPatch}/>
            <ModalConfirm show={showModalConfirm} onHide={handleCloseModalConfirm} title={title} handleConfirm={handleConfirmDeleteSection}/>         
        </Container>        
    )
}

export default Home;