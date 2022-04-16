import React, { useState, useEffect } from 'react';
import { Button, Col, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { Bell } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router';
import req from '../../helpers/request';

const Notifications: React.FC<any> = ({show, handleShow, user, userLogged, notis, bellColor}): JSX.Element => {
    const navigate = useNavigate();

    const changeColorToDefault = async (): Promise<any> => {
        try {
            const result = await req.get(`noti`)
            if(result.data.positive) {
                for(let i=0;i<notis.length;i++){
                    user.notifications[i].toDisplay = false;
                }
                console.log(user)
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
        } catch {
        }        
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
                    notis.sort((a: any, b: any) => b.createAt.localeCompare(a.createAt)).slice(0,10).map((noti: any)=> {
                      return (  
                        <Popover.Body key={noti.id}>
                            <Row>
                                <Col>
                                    <small className='text-muted d-flex justify-content-end'>{noti.createAt}</small>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <small onClick={() => handleRedirectToTopic(noti.topicId)}>{noti.message}</small>
                                </Col>
                                <Col xs='auto'>
                                    <small><strong>{noti.fromWho}</strong></small>
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