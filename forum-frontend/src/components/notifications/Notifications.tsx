import React from 'react';
import { Button, Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import req from '../../helpers/request';
import { NotiI } from '../header/Header';

interface IProps {
    show: boolean;
    handleShow: any;
    userLogged: boolean;
    notis: NotiI[];
    bellColor: JSX.Element;
}

const Notifications: React.FC<IProps> = ({show, handleShow, userLogged, notis, bellColor}): JSX.Element => {
    const navigate = useNavigate();

    const changeColorToDefault = async (): Promise<void> => {
        try {
            await req.patch(`noti`);
        } catch {}        
    }

    const handleCloseNoti = () => {
        handleShow((prev: boolean) => !prev)
        changeColorToDefault();
    }

    const handleRedirectToTopic = (id: string) => {
        navigate(`/sekcja/${id}`);
        handleShow((prev: boolean) => !prev);
        changeColorToDefault();
    }

    return (
        <>
            <OverlayTrigger show={show} onHide={handleShow}
                trigger="click"
                placement='bottom'
                overlay={
                    <Popover id={`popover-positioned-bottom`}>
                    <Popover.Header as="h3">{`Powiadomienia`}</Popover.Header>
                    {userLogged && notis.length > 0 && 
                    notis.map((noti: NotiI)=> {
                      return (  
                        <Popover.Body key={noti.id} onClick={() => handleRedirectToTopic(noti.topicId)} style={{cursor: 'pointer'}}>
                            <Row>
                                <Col>
                                    <small className='text-muted d-flex justify-content-end'>{noti.createAt}</small>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <small>{noti.message}</small>
                                </Col>
                            </Row>                            
                        </Popover.Body>
                      )
                    })                    
                    }                    
                    </Popover>
                }
                >
                <Button onClick={handleCloseNoti} variant="dark">{bellColor}</Button>
            </OverlayTrigger>
        </>
    )
}

export default Notifications;