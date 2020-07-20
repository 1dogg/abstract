var ReactDOM = require('react-dom');
var React = require('react');
import Header from './Header.jsx';
import CssBaseline from '@material-ui/core/CssBaseline'
import { Input, Checkbox, Gapped, DatePicker, Tooltip, ComboBox, Toast } from '@skbkontur/react-ui';
import Button from '@material-ui/core/Button'
const axios = require('axios').default;

let pageStyle = {
    background: '#e6e6e6',
    height: "100%",
    border: '1px solid #dedfdf',
    overflow: 'scroll',
    fontFamily: 'Segoe UI'
};

let bodyContainerStyle = {
    textAlign: "center"
};

let containerStyle = {
    textAlign: "left",
    display: "inline-block"
};

let labelStyle = {
    display: "inline-block",
    width: "64px"
};

let mapDepartment = ({ departmentID, departmentName, departmentFloor }) => ({
    value: departmentID,
    label: departmentName + ' - ' + departmentFloor + ' ' + 'этаж',
});

let mapLanguage = ({ programmLanguageID, name }) => ({
    value: programmLanguageID,
    label: name,
});

class UserEditPage extends React.Component {
    constructor(props) {
        super(props);
        let now = new Date();
        this.nowStr = now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear();
        this.state = {
            employeeId: props.employeeId,
            name: "",
            family: "",
            sex: false,
            date: "",
            maxDate: this.nowStr,
            minDate: "01.01.1900",
            tooltip: false,
            error: false,
            department: {},
            programmLanguage: {},
            validateResult: '',
            validationData: [],
            popularNames: [],
            popularFamilies: []
        };
    }

    componentDidMount() {
        axios.get('/names')
            .then((response) => {
                this.setState({ popularNames: response.data });
            })

        axios.get('/families')
            .then((response) => {
                this.setState({ popularFamilies: response.data });
            })

        if (this.state.employeeId > 0) {
            axios.get('/employee/' + this.state.employeeId)
                .then((response) => {
                    let employee = response.data;
                    console.log(employee);
                    if (employee) {
                        this.setState({
                            name: employee.name,
                            family: employee.family,
                            sex: employee.sex > 0 ? true : false,
                            date: employee.birthDate,
                            department: {
                                value: employee.departmentID,
                                label: employee.department
                            },
                            programmLanguage: {
                                value: employee.programmLanguageID,
                                label: employee.programmLanguage
                            }
                        });
                    }
                })
        }
    }

    showComplexNotification() {
        Toast.push('Пользователь успешно сохранен!');
    }

    renderItem = (item) => (
        <Gapped>
            <div style={{ width: 40 }}>{item.value}</div>
            <div style={{ width: 210, whiteSpace: 'normal' }}>{item.label}</div>
        </Gapped>
    )


    prepareItemsDepartment = (query, items) =>
        items.slice(0, -1).map(mapDepartment)
    prepareItemsLanguage = (query, items) =>
        items.slice(0, -1).map(mapLanguage)

    getDepartments = (query) => axios.get('/departments', {
        params: {
            name: query
        }
    })
    getLanguages = (query) => axios.get('/programmlanguages', {
        params: {
            name: query
        }
    })

    getDepartmentsItems = (query) => this.getDepartments(query)
        .then((response) => { console.log(response);return response.data.map(mapDepartment); })

    getLanguageItems = (query) => this.getLanguages(query)
        .then((response) => response.data.map(mapLanguage))

    validateForm = () => {
        let validationErrors = [];
        if (!this.state.name) {
            validationErrors.push("Заполните имя!");
        }

        if (!this.state.family) {
            validationErrors.push("Заполните фамилию!");
        }

        if (!this.state.date) {
            validationErrors.push("Укажите дату рождения!");
        }

        if (!this.state.department) {
            validationErrors.push("Укажие отдел!");
        }

        if (!this.state.programmLanguage) {
            validationErrors.push("Выберите язык программирования!");
        }

        return validationErrors;
    }

    renderValidationData = () => (
        <div
            style={{
                width: 'auto',
                fontSize: 16,
                fontFamily: 'Segoe UI'
            }}>
            <ul>
                {this.state.validationData.map((error, i) => {
                    return (<li>{error}</li>)
                })}
            </ul>
        </div>
    )

    createOrUpdateEmployee = () => {
        var errors = this.validateForm();
        if (errors.length > 0) {
            this.setState({ validateResult: 'error', validationData: errors });
            return;
        }

        axios({
            method: 'post',
            url: '/createorupdate',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                EmployeeId: this.state.employeeId,
                Name: this.state.name,
                Family: this.state.family,
                Sex: this.state.sex,
                BirthDate: this.state.date,
                ProgrammLanguageID: this.state.programmLanguage.value,
                DepartmentID: this.state.department.value
            }
        }).then((response) => {
            this.showComplexNotification();

            if (response.status == 204) {
                window.location.href = '/';
                return;
            }

            this.setState({
                name: "",
                family: "",
                sex: false,
                date: "",
                maxDate: this.nnowStr,
                minDate: "01.01.1900",
                tooltip: false,
                error: false,
                department: {},
                programmLanguage: {},
                validateResult: '',
                validationData: []
            });
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div style={pageStyle}>
                <datalist id="names-list">
                    {this.state.popularNames.length > 0 ? this.state.popularNames.map((item, key) => {
                        return (<option key={key} value={item.name} />)
                    }) : ""}
                </datalist>
                <datalist id="families-list">
                    {this.state.popularFamilies.length > 0 ? this.state.popularFamilies.map((item, key) => {
                        return (<option key={key} value={item.name} />)
                    }) : ""}
                </datalist>
                <Header />
                <CssBaseline />
                <div style={bodyContainerStyle}>
                    <Gapped vertical gap={2}>
                        <div style={containerStyle}>
                            <Gapped vertical gap={10}>
                                <Gapped>
                                    <label htmlFor="name" style={labelStyle}>Имя</label>
                                    <Input id="name" width="160" value={this.state.name} list="names-list" autoComplete="off" onValueChange={(value) => this.setState({ name: value })} />
                                </Gapped>
                                <Gapped>
                                    <label htmlFor="family" style={labelStyle}>Фамилия</label>
                                    <Input id="family" width="160" value={this.state.family} list="families-list" autoComplete="off" onValueChange={(value) => this.setState({ family: value })} />
                                </Gapped>

                                <Gapped>
                                    <label style={labelStyle}>Пол</label>
                                    <Checkbox checked={!this.state.sex} onValueChange={value => this.setState({ sex: !value })}>
                                        Женский
                                </Checkbox>
                                    <Checkbox checked={this.state.sex} onValueChange={value => this.setState({ sex: value })}>
                                        Мужской
                                </Checkbox>
                                </Gapped>
                                <Gapped>
                                    <label>Дата рождения</label>
                                    <Tooltip trigger={this.state.tooltip ? 'opened' : 'closed'} render={() => 'Невалидная дата'} onCloseClick={() => this.setState({ tooltip: false })}>
                                        <DatePicker width="122"
                                            minDate={this.state.minDate}
                                            maxDate={this.state.maxDate}
                                            value={this.state.date}
                                            onValueChange={(value) => this.setState({ date: value, tooltip: false })}
                                            onFocus={() => this.setState({ tooltip: false, error: false })}
                                            onBlur={(value) => this.setState(state => {
                                                const error =
                                                    !!this.state.date && !DatePicker.validate(this.state.date, { minDate: this.state.minDate, maxDate: this.state.maxDate });
                                                return { tooltip: error, error: error };
                                            })} />
                                    </Tooltip>
                                </Gapped>
                                <Gapped>
                                    <label>Отдел</label>
                                    <ComboBox
                                        onValueChange={(value) => this.setState({ department: value })}
                                        getItems={this.getDepartmentsItems}
                                        placeholder="Начните вводить название отдела"
                                        value={this.state.department}
                                        renderItem={this.renderItem}
                                    />
                                </Gapped>
                                <Gapped>
                                    <label>Язык программирования</label>
                                    <ComboBox
                                        onValueChange={(value) => this.setState({ programmLanguage: value })}
                                        getItems={this.getLanguageItems}
                                        placeholder="Начните вводить название языка"
                                        value={this.state.programmLanguage}
                                        renderItem={this.renderItem}
                                    />
                                </Gapped>
                            </Gapped>
                        </div>
                        <br />
                        <Tooltip trigger={this.state.validateResult == 'error' ? 'opened' : 'closed'} render={this.renderValidationData} onCloseClick={() => this.setState({ validateResult: '' })}>
                            <Button variant="contained" color="primary" size="medium"
                                onClick={this.createOrUpdateEmployee}>
                                Сохранить
                            </Button>
                        </Tooltip>
                    </Gapped>
                </div>
            </div>
        );
    }
}

export default UserEditPage;