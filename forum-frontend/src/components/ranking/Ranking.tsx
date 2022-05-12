import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';
import { ThemeContext } from '../../store/StoreProvider';

const Ranking: React.FC<any> = ({score}): JSX.Element => {
    const { theme } = useContext(ThemeContext);
    return (
        <>
            <Table striped bordered hover variant={theme.tableColor}>
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
                            <td>{s.user?.login}</td>
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