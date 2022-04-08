import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import req from '../../helpers/request';
import { Container, Row, Col, Nav, Button } from 'react-bootstrap';
import { ChatRightText } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import { UserContext } from '../../store/StoreProvider';
import ModalSection from '../modalSection/ModalSection';
import ModalInfo from '../modal/ModalInfo';

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

    const { user } = useContext(UserContext);

    const navigate = useNavigate();

    const sectionData = async (): Promise<void> => {
        const data = await req.get('section');
        setSection(data.data);
        console.log(section)
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
        setNewSectionName('');
    }

    const handleNewSection = (e: ChangeEvent<HTMLInputElement>) => setNewSectionName(e.target.value);
    const handleCloseModal = () => {
        cleanModalSection();
        setText('');
    }
    
    const handleAddSectionPost = async (): Promise<void> => {
        cleanModalSection();
        setShowModalInfo(true);
        const result = await req.post('section/add', {
            sectionName: newSectionName
        });
        setText(result.data.message);
        console.log(result.data)
    }

    const handleCloseModalInfo = () => {
        setShowModalInfo(false);
    }

    return (        
        <Container className='my-5 text-light'>
            <p className='text-secondary mb-5'>Witaj na forum, gdzie możesz porozmawiać na każdy temat. Wystarczy, że odszukasz odpowiedni dział,
                a następnie temat lub założysz swój własny! Zapraszamy również do odwiedzenia Komunikatora, gdzie
                można porozmawiać z wybranymi osobami, a także zajrzeć do zakładki "Nuda" :)
            </p>
            {user.role === 'admin' ? <Button className='mb-2' variant='outline-light' onClick={handleAddSectionButton}>Dodaj nową sekcje</Button> : null}
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
                        </Row>
                    )
                })
            }
            <ModalSection show={showModalSection} onHide={handleCloseModal} handleNewSection={handleNewSection} newSectionName={newSectionName} handleAddSectionPost={handleAddSectionPost}/>
            <ModalInfo show={showModalInfo} onHide={handleCloseModalInfo} text={text}/>         
        </Container>        
    )
}

export default Home;