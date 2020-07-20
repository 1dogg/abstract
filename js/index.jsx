var ReactDOM = require('react-dom');
var React = require('react');
import Header from './components/Header.jsx';
import CssBaseline from '@material-ui/core/CssBaseline'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import { Toast } from '@skbkontur/react-ui';
import { useTable, useRowSelect } from 'react-table'
const axios = require('axios').default;

let pageStyle = {
    background: '#e6e6e6',
    height: "100%",
    border: '1px solid #dedfdf',
    overflow: 'scroll',
};

let Table = ({ columns, data, deleteEmployee }) => {
    console.log(data);
    let { getTableProps, headerGroups, rows, prepareRow } = useTable({
            columns,
            data,
            initialState: { hiddenColumns: "id" }
        },
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                ...columns,
                {
                    id: 'action',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: () => (
                        <div>
                            Действие
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => {
                        return (
                            <div>
                                <Button color="primary" size="small" onClick={() => { window.location.href = '/edit/' + row.original.id; }}>
                                    Редактировать
                                </Button>
                                <Button color="secondary" size="small" onClick={() => deleteEmployee(row.original.id)}>
                                    Удалить
                                </Button>
                            </div>
                        )
                    },
                }
            ])
        }
    )

    // Render the UI for your table
    return (
        <MaUTable {...getTableProps()}>
            <TableHead>
                {headerGroups.map(headerGroup => (
                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <TableCell {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableHead>
            <TableBody>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <TableRow {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return (
                                    <TableCell {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    )
                })}
            </TableBody>
        </MaUTable>
    )
}

class UserListPage extends React.Component {
    constructor(props) {
        super(props);
        let now = new Date();
        let nowStr = now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear();
        this.state = {
            columns: [],
            data: []
        };
    }

    componentDidMount() {
        this.setState({
            columns: [
                {
                    Header: 'ID',
                    accessor: 'id',
                },
                {
                    Header: 'Имя',
                    accessor: 'name',
                },
                {
                    Header: 'Фамилия',
                    accessor: 'family',
                },
                {
                    Header: 'Пол',
                    accessor: 'sex',
                },
                {
                    Header: 'Дата рождения',
                    accessor: 'birthDate',
                },
                {
                    Header: 'Отдел',
                    accessor: 'department',
                },
                {
                    Header: 'Язык программирования',
                    accessor: 'programmLanguage',
                }
            ]
        })

        axios.get('/employeers')
            .then((response) => this.setState({ data: response.data }))
    }

    showComplexNotification() {
        Toast.push('Пользователь успешно удален!');
    }

    deleteEmployee = (id) => {
        console.log(this.state);
        axios.delete('/deleteemployee/' + id)
            .then((response) => {
                let data = this.state.data;
                let indexToRemove = data.findIndex(function (i) {
                    return i.id === id;
                })
                let newData = data.slice(0, indexToRemove).concat(data.slice(indexToRemove + 1));

                this.setState({ data: newData });

                this.showComplexNotification();
            })
    }

    render() {
        console.log('render');
        return (
            <div style={pageStyle}>
                <Header />
                <CssBaseline />
                <Table columns={this.state.columns} data={this.state.data} deleteEmployee={this.deleteEmployee} />
            </div>
        )
    }
}

ReactDOM.render(<UserListPage />, document.getElementById('content'));