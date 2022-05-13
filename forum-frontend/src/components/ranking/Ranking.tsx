import React, { useContext } from 'react';
import { Table } from 'react-bootstrap';
import { ThemeContext } from '../../store/StoreProvider';

interface RankingI {
    id: string;
    name: string;
    numberPoints: number;
    user?: any;
}

interface ScoreI {
    score: RankingI[]
}

const Ranking: React.FC<ScoreI> = ({score}): JSX.Element => {
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
                    {score.map((s: RankingI, index: number) => {
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