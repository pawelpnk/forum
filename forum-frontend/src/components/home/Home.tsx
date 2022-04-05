import React, { useEffect, useState } from 'react';
import req from '../../helpers/request';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { ChatRightText } from 'react-bootstrap-icons';

interface SectionType {
    id: string;
    sectionName: string;
}

const Home: React.FC = (): JSX.Element => {

    const [section, setSection] = useState<SectionType[]>([]);

    const sectionData = async (): Promise<void> => {
        const data = await req.get('section');
        setSection(data.data);
    }

    useEffect(() => {
        sectionData();
    },[]);

    return (
        <>
        {console.log(section)}

        
         <Container className='my-5 text-light'>
         <p className='text-secondary mb-5'>Witaj na forum, gdzie możesz porozmawiać na każdy temat. Wystarczy, że odszukasz odpowiedni dział,
             a następnie temat lub założysz swój własny! Zapraszamy również do odwiedzenia Komunikatora, gdzie
             można porozmawiać z wybranymi osobami, a także zajrzeć do zakładki "Nuda" :)</p>
         {   
            section.map((sec: any) => {
                return (
                    <Row key={sec.id} className='border py-3'>
                        <Col sm={1} className='px-4 d-flex justify-content-center align-items-center'>
                            <ChatRightText />
                        </Col>
                        <Col sm={5}>
                            <Nav.Link href={`/${sec.id}`}>{sec.sectionName}</Nav.Link>
                        </Col>
                    </Row>
                )
            })
        }             
         
        </Container>
       
        </>
    )
}

export default Home;