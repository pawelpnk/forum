import React from 'react';
import { Table } from 'react-bootstrap';

const Ranking: React.FC<any> = ({score}): JSX.Element => {
    return (
        <>
            <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                <th>#</th>
                <th>Gracz</th>
                <th>Gra</th>
                <th>Punkty</th>
                </tr>
            </thead>
            <tbody>
                {score.map((s:any, index: number) => {
                    return (
                        <tr key={s.id}>
                            <td>{index + 1}</td>
                            <td>{s.name}</td>
                            <td>{s.name}</td>
                            <td>{s.numberPoints}</td>
                        </tr>
                    )
                })}              
            </tbody>
            </Table>
        </>
    )
}

export default Ranking;